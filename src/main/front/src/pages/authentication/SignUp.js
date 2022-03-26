import React, { useState } from 'react';
import MainLayout from "../../components/layout/MainLayout";
import {
    Box, Button,
    Link, Modal, Stack,
    TextField,
    Typography
} from "@mui/material";
import { Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";
import styled from "styled-components";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ajax from "../../api/axiosInterceptor";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAddMember } from "../../api/queries";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [isOpenModal, setOpenModal] = useState(false);
    const handleModalClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpenModal(false);
        }
    };
    
    const schema = yup.object().shape({
        id: yup.string()
            .required("아이디를 입력하세요.")
            .min(6, ({ min }) => `아이디는 ${min}자 이상이어야 합니다.`)
            .max(20, ({ max }) => `아이디는 최대 ${max}자까지 입니다.`)
            .matches("^[a-z0-9_-]*$", "아이디는 영문 소문자, 숫자, 특수기호(_)(-)만 사용 가능합니다.")
            .test("exist", "이미 사용중인 아이디입니다.",
                async value => !await ajax.get("/member/has", {
                    params: {
                        id: value
                    }
                })
            ),
        password: yup.string()
            .required("비밀번호를 입력하세요.")
            .min(8, ({ min }) => `비밀번호는 ${min}자 이상이어야 합니다.`)
            .max(24, ({ max }) => `비밀번호는 최대 ${max}자까지 입니다.`)
            .matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]*$", "비밀번호는 영문, 숫자, 특수기호가 모두 사용되어야 합니다."),
        password2: yup.string()
            .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
        name: yup.string()
            .required("이름을 입력하세요.")
            .min(2, ({ min }) => `이름은 ${min}자 이상이어야 합니다.`)
            .max(12, ({ max }) => `이름은 최대 ${max}자까지 입니다.`)
            .matches("^[가-힣a-zA-Z0-9]*$", "이름은 한글과 영문, 숫자만 사용가능합니다.")
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema)
    });
    const { mutateAsync: mutateAsyncSignUp, isLoading } = useAddMember();
    const handleValid = async form => {
        await mutateAsyncSignUp(form, {
            onSuccess: () => {
                setOpenModal(true);
            }
        });
    };
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="3" color="text.primary">회원가입</Typography>,
    ];
    
    return (
        <MainLayout>
            <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
            <Box sx={{ display: "flex", width: { mobile: 1, tablet: '500px' } }}>
                <SignUpForm onSubmit={ handleSubmit(handleValid) }>
                    <Stack>
                        <TextField
                            label="아이디"
                            variant="outlined"
                            autoComplete="off"
                            margin="normal"
                            error={ errors.id ? true : false }
                            helperText={ errors.id?.message }
                            fullWidth
                            { ...register("id") }
                        />
                        <TextField
                            label="이름"
                            variant="outlined"
                            autoComplete="off"
                            margin="normal"
                            error={ errors.name ? true : false }
                            helperText={ errors.name?.message }
                            fullWidth
                            { ...register("name") }
                        />
                        <TextField
                            type="password"
                            label="비밀번호"
                            variant="outlined"
                            autoComplete="off"
                            margin="normal"
                            error={ errors.password ? true : false }
                            helperText={ errors.password?.message }
                            fullWidth
                            { ...register("password") }
                        />
                        <TextField
                            type="password"
                            label="비밀번호 확인"
                            variant="outlined"
                            autoComplete="off"
                            margin="normal"
                            error={ errors.password2 ? true : false }
                            helperText={ errors.password2?.message }
                            fullWidth
                            { ...register("password2") }
                        />
                        <ButtonField>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={ isLoading }
                                fullWidth
                            >
                                회원가입
                            </LoadingButton>
                        </ButtonField>
                    </Stack>
                </SignUpForm>
            </Box>
            <Modal
                open={ isOpenModal }
                onClose={ handleModalClose }
            >
                <ModalWrapper>
                    <ModalHeader>알림</ModalHeader>
                    <ModalContent>회원가입 완료이 완료되었습니다.</ModalContent>
                    <ModalAction>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ borderRadius: 0 }}
                            onClick={ () => navigate('/login') }
                        >로그인페이지로 이동</Button>
                    </ModalAction>
                </ModalWrapper>
            </Modal>
        </MainLayout>
    );
};

export default SignUp;

const SignUpForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
`;
const ButtonField = styled.div`
    width: 100%;
    margin-top: 16px;
    margin-bottom: 8px;
`;
const ModalWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 400px;
    width: 100%;
    border-radius: 4px;
    background-color: white;
    box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
    user-select: none;
`;
const ModalHeader = styled.div`
    padding: 16px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
`;
const ModalContent = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 40px 20px;
`;
const ModalAction = styled.div`

`;