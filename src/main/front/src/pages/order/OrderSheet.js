import React, { useEffect, useState } from 'react';
import SimpleLayout from "../../components/layout/SimpleLayout";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog, FormControl,
    FormControlLabel,
    Radio, RadioGroup,
    Tab,
    Tabs,
    TextField, Typography
} from "@mui/material";
import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {
    useFetchShippingPlaces,
    useFetchShippingPlaceBasicNo,
    useUpdateShippingPlace,
    useFetchShippingPlace, useRemoveShippingPlace
} from "../../api/queries";
import { LoadingButton } from "@mui/lab";
import { grey } from "@mui/material/colors";
import { useQueryClient } from "react-query";
import { queryKeys, queryKeywords } from "../../api/queryKeys";

const ShippingAddressSelector = ({ onChangeShippingAddressPlace, selectedShippingPlaceNo }) => {
    const queryClient = useQueryClient();
    
    // 배송지 목록 및 등록 선택 탭
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };
    
    const [isPostOpen, setPostOpen] = useState(false);  // 우편번호 검색 다이얼로그
    
    const handleTextFieldChange = event => {};
    
    const { isLoading: isFetchShippingPlaceLoading, isFetching: isFetchShippingPlaceFetching, isSuccess: isFetchShippingPlaceSuccess, data: shippingPlaceList } = useFetchShippingPlaces();
    const { data: shippingPlaceBasicNo } = useFetchShippingPlaceBasicNo();
    const { isLoading: isUpdateShippingPlaceLoading, mutateAsync: mutateAsyncUpdateShippingPlace } = useUpdateShippingPlace();
    const { isLoading: isRemoveShippingPlaceLoading, mutateAsync: mutateAsyncRemoveShippingPlace } = useRemoveShippingPlace();
    
    const [radioValue, setRadioValue] = useState(selectedShippingPlaceNo);
    const handleRadioClick = no => {
        setRadioValue(no);
        onChangeShippingAddressPlace(no);
    };
    
    // 새 배송지 등록 폼 유효성 검사
    const [roadAddress, setRoadAddress] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [helperText, setHelperText] = useState('');   // invalid 원인
    const schema = yup.object().shape({
        placeName: yup.string()
            .required("배송지명을 입력해주세요.")
            .max(20, ({ max }) => `배송지명은 최대 ${max}자까지 입니다.`),
        receiver: yup.string()
            .required("수취인명을 입력해주세요.")
            .max(30, ({ max }) => `수취인명은 최대 ${max}자까지 입니다.`),
        phone: yup.string()
            .required("연락처를 입력해주세요.")
            .max(20, ({ max }) => `연락처 길이는 최대 ${max}자까지 입니다.`),
        zipCode: yup.string()
            .required("우편번호를 검색해주세요."),
        roadAddress: yup.string()
            .required("우편번호를 검색해주세요.")
        
    });
    const { register, handleSubmit, setValue, getValues, reset } = useForm({
        mode: "onSubmit",
        resolver: yupResolver(schema)
    });
    const handleValid = async form => {
        await mutateAsyncUpdateShippingPlace(form, {
            onSuccess: ({ code }) => {
                if (code === "200") {
                    queryClient.invalidateQueries(queryKeys.shippingAddress[queryKeywords.principal]);
                    reset();
                    setRoadAddress('');
                    setZipCode('');
                    setTabIndex(0); // 배송지 목록으로 탭 이동
                    setRadioValue(form.no);
                }
            }
        });
    };
    const handleError = errors => {
        setHelperText(errors[Object.keys(errors)[0]].message);
    };
    const handleSearchPostComplete = data => {
        const { roadAddress, zonecode } = data;
        setValue("roadAddress", roadAddress);
        setValue("zipCode", zonecode);
        setRoadAddress(roadAddress);
        setZipCode(zonecode);
        setPostOpen(false);
    };
    
    return (
        <Box sx={{ width: 1, p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={ tabIndex } onChange={ handleTabChange }>
                    <Tab label="배송지 목록" sx={{ flexGrow: 1 }} />
                    <Tab label="배송지 등록" sx={{ flexGrow: 1 }} />
                </Tabs>
            </Box>
            <Box hidden={ tabIndex !== 0 } /* 배송지 목록 */>
                {
                    (isFetchShippingPlaceLoading || isFetchShippingPlaceFetching) &&
                    <Box sx={{ width: 1, my: 5, textAlign: "center" }}>
                        <CircularProgress />
                    </Box>
                }
                {
                    !isFetchShippingPlaceFetching && isFetchShippingPlaceSuccess &&
                    <Box sx={{ display: "flex" }}>
                        <FormControl sx={{ width: 1 }}>
                            <RadioGroup value={ radioValue || '' } onChange={ event => setRadioValue(event.target.value) } sx={{ width: 1 }}>
                                {
                                    shippingPlaceList.map(place => {
                                        return (
                                            <FormControlLabel
                                                key={ place.no } value={ place.no } control={ <Radio size="small" /> }
                                                sx={{ display: "flex", alignItems: "flex-start", mx: 0, py: 1, borderBottom: `1px solid ${ grey[500] }` }}
                                                label={
                                                    <Box sx={{ display: "flex", minHeight: "74px" }}>
                                                        <Box>
                                                            {
                                                                shippingPlaceBasicNo === place.no &&
                                                                <Typography variant="body2">[기본배송지]</Typography>
                                                            }
                                                            <Typography variant="body2">{ `(${ place.placeName }) ${ place.receiver }` }</Typography>
                                                            <Typography variant="body2">{ `${ place.roadAddress } ${ place.additionalAddress || '' }` }</Typography>
                                                            <Typography sx={{ color: grey["500"] }} variant="body2">{ place.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) }</Typography>
                                                        </Box>
                                                        <Box sx={{ display: "flex", flexDirection: "column", position: "absolute", right: 0 }}>
                                                            <Button onClick={ event => {
                                                                event.stopPropagation();
                                                                // 배송지 등록 폼에 데이터 불러오기
                                                                setTabIndex(1);
                                                                setValue("no", place.no);
                                                                setValue("placeName", place.placeName);
                                                                setValue("receiver", place.receiver);
                                                                setValue("phone", place.phone);
                                                                setValue("roadAddress", place.roadAddress);
                                                                setValue("zipCode", place.zipCode);
                                                                setRoadAddress(place.roadAddress);
                                                                setZipCode(place.zipCode);
                                                                setValue("additionalAddress", place.additionalAddress);
                                                            }}>
                                                                수정
                                                            </Button>
                                                            <LoadingButton loading={ isRemoveShippingPlaceLoading } onClick={ async event => {
                                                                event.stopPropagation();
                                                                await mutateAsyncRemoveShippingPlace(place.no, {
                                                                    onSuccess: ({ code }) => {
                                                                        if (code === "200") {
                                                                            queryClient.invalidateQueries(queryKeys.shippingAddress[queryKeywords.principal]);
                                                                        }
                                                                    }
                                                                })
                                                            }}>
                                                                삭제
                                                            </LoadingButton>
                                                        </Box>
                                                    </Box>
                                                }
                                                onClick={ () => handleRadioClick(place.no) }
                                            />
                                        );
                                    })
                                }
                            </RadioGroup>
                        </FormControl>
                    </Box>
                }
            </Box>
            <Box hidden={ tabIndex !== 1 } /* 배송지 등록 */>
                <form onSubmit={ handleSubmit(handleValid, handleError) }>
                    <TextField { ...register("no") } sx={{ display: "none" }} />
                    <TextField
                        placeholder="배송지명"
                        size="small" margin="dense" autoComplete="off" fullWidth
                        inputProps={{ maxLength: 10 }}
                        { ...register("placeName") }
                    />
                    <TextField
                        placeholder="받는 사람"
                        size="small" margin="dense" autoComplete="off" fullWidth
                        inputProps={{ maxLength: 30 }}
                        { ...register("receiver") }
                    />
                    <TextField
                        type="number"
                        placeholder="연락처"
                        size="small" margin="dense" autoComplete="off" fullWidth
                        inputProps={{ maxLength: 20 }}
                        { ...register("phone") }
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            placeholder="우편번호"
                            value={ zipCode }
                            onChange={ handleTextFieldChange }
                            size="small" margin="dense" disabled
                            autoComplete="off"
                            inputProps={{ style: { WebkitTextFillColor: "black" } }}
                            { ...register("zipCode") }
                        />
                        <Button variant="outlined" sx={{ py: "7px", ml: 1, mt: 0.5 }} onClick={ () => setPostOpen(true) }>우편번호 찾기</Button>
                    </Box>
                    <TextField
                        placeholder="주소"
                        value={ roadAddress }
                        onChange={ handleTextFieldChange }
                        size="small"
                        margin="dense"
                        autoComplete="off"
                        fullWidth disabled
                        inputProps={{ style: { WebkitTextFillColor: "black" } }}
                        { ...register("roadAddress") }
                    />
                    <TextField
                        placeholder="나머지 주소"
                        size="small" margin="dense" autoComplete="off" fullWidth
                        inputProps={{ maxLength: 100 }}
                        { ...register("additionalAddress") } />
                    <FormControlLabel control={ <Checkbox checked={ shippingPlaceBasicNo === getValues("no") } { ...register("basic") } /> } label="기본배송지 설정" />
                    <Box sx={{ display: "flex", width: 1, justifyContent: "space-between", alignItems: "center", color: "red" }}>
                        <Box>{ helperText }</Box>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={ isUpdateShippingPlaceLoading }
                        >
                            저장
                        </LoadingButton>
                    </Box>
                </form>
            </Box>
            <Dialog open={ isPostOpen } onClose={ () => setPostOpen(false) } fullWidth>
                <DaumPostcode onComplete={ handleSearchPostComplete } /* https://github.com/bernard-kms/react-daum-postcode */ />
            </Dialog>
        </Box>
    );
};

const OrderSheet = () => {
    const [isOpenShippingAddressSelector, setOpenShippingAddressSelector] = useState(false);
    const handleOpenShippingAddressSelector = () => {
        setOpenShippingAddressSelector(true);
    };
    
    const [shippingPlaceNo, setShippingPlaceNo] = useState('');
    const { data: shippingPlaceBasicNo } = useFetchShippingPlaceBasicNo();
    const {
        isLoading: isFetchShippingPlaceLoading,
        isSuccess: isFetchShippingPlaceSuccess,
        data: shippingPlace
    } = useFetchShippingPlace(shippingPlaceNo);
    
    const handleChangeShippingAddressPlace = no => {
        setShippingPlaceNo(no);
        setOpenShippingAddressSelector(false);
    };
    useEffect(() => {
        setShippingPlaceNo(shippingPlaceBasicNo);
    },[shippingPlaceBasicNo]);
    
    return (
        <SimpleLayout title="구매하기">
            <Wrapper>
                {
                    !isOpenShippingAddressSelector &&
                    <Box sx={{ width: 1, backgroundColor: grey[100] }}>
                        <Section /* 배송지 정보 */>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>배송정보</Typography>
                            {
                                isFetchShippingPlaceLoading &&
                                <Box sx={{ width: 1, my: 5, textAlign: "center" }}>
                                    <CircularProgress />
                                </Box>
                            }
                            {
                                isFetchShippingPlaceSuccess && shippingPlace &&
                                <Box sx={{ display: "flex", position: "relative", mt: 1 }}>
                                    <Box>
                                        <Typography variant="body2">{ `(${ shippingPlace.placeName }) ${ shippingPlace.receiver }`}</Typography>
                                        <Typography variant="body2">{ `${ shippingPlace.roadAddress } ${ shippingPlace.additionalAddress || ''}` }</Typography>
                                        <Typography
                                            sx={{color: grey["500"]}}
                                            variant="body2"
                                        >
                                            { shippingPlace.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) }
                                        </Typography>
                                    </Box>
                                    <Box sx={{position: "absolute", right: 0}}>
                                        <Button size="small" onClick={ handleOpenShippingAddressSelector }>
                                            변경
                                        </Button>
                                    </Box>
                                </Box>
                            }
                            {
                                isFetchShippingPlaceSuccess && !shippingPlace &&
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>등록된 배송지가 없습니다.</Typography>
                                    <Button variant="outlined" size="small" onClick={ handleOpenShippingAddressSelector }>등록</Button>
                                </Box>
                            }
                        </Section>
                    </Box>
                }
                {
                    isOpenShippingAddressSelector &&
                    <ShippingAddressSelector
                        selectedShippingPlaceNo={ shippingPlaceNo }
                        onChangeShippingAddressPlace={ handleChangeShippingAddressPlace }
                    />
                }
            </Wrapper>
        </SimpleLayout>
    );
};

export default OrderSheet;

const Wrapper = styled.div`
	display: flex;
    flex-direction: column;
	align-items: center;
	width: 100%;
    max-width: ${ ({ theme }) => theme.breakpoints.values.laptop }px;
`;
const Section = styled.div`
    padding: 16px 12px;
    margin: 8px 0;
    background-color: white;
`;