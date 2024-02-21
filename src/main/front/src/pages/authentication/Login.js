import React, { useState } from 'react';
import { useMutation } from "react-query";
import { default as ajax } from "../../ajax/axiosInterceptor";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import styled from "styled-components";
import MainLayout from "../../components/layouts/MainLayout";
import TitleAndBreadcrumbs from "../../components/TitleAndBreadcrumbs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useLocation,  } from "react-router-dom";
import { useNavigate } from "react-router";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [isOpenLoginFailureDialog, setOpenLoginFailureDialog] = useState(false);
    const [loginFailureMessage, setLoginFailurMessage] = useState('');

    const schema = yup.object().shape({
        id: yup.string()
            .required("아이디를 입력하세요."),
        password: yup.string()
            .required("비밀번호를 입력하세요")
    });
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur",
        resolver: yupResolver(schema)
    });
    const {
        mutateAsync: mutateAsyncLogin,
        isLoading: isLoadingLogin
    } = useMutation({
        mutationFn: ({ form }) => ajax.post("/members/login", null, { params: form }),
        useErrorBoundary: false
    });
    const handleValidatedForm = async form => {
        await mutateAsyncLogin({ form: form }, {
            onSuccess: data => {
                if (data["Authorization"] && data["code"] === undefined) {
                    // 로그인 성공시
                    const previousPage = location.state?.from;
                    if (previousPage) {
                        window.location.href = previousPage;
                    } else {
                        navigate('/', { replace: true });
                    }
                }
            },
            onError: error => {
                setOpenLoginFailureDialog(true);
                setLoginFailurMessage(error.data.message);
            }
        });
    }

    const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "로그인" }
    ];

    return (
        <MainLayout title="로그인">
            <TitleAndBreadcrumbs text="로그인" links={ breadcrumbs } />
            <Wrapper>
                <LoginForm onSubmit={ handleSubmit(handleValidatedForm) }>
                    <TextFieldWrapper>
                        <TextField
                            label="아이디"
                            variant="outlined"
                            autoComplete="off"
                            fullWidth
                            { ...register("id") }
                            error={ !!errors.id }
                            helperText={ errors.id?.message }
                        />
                    </TextFieldWrapper>
                    <TextFieldWrapper>
                        <TextField
                            label="비밀번호"
                            type="password"
                            variant="outlined"
                            autoComplete="off"
                            fullWidth
                            { ...register("password") }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </TextFieldWrapper>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={ isLoadingLogin }
                    >로그인</LoadingButton>
                </LoginForm>
            </Wrapper>
            <Dialog
                open={ isOpenLoginFailureDialog }
                onClose={ () => setOpenLoginFailureDialog(false) }
            >
                <DialogTitle>
                    <Typography variant="h5" gutterBottom>로그인에 실패했습니다.</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography>{ loginFailureMessage }</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpenLoginFailureDialog(false) }>확인</Button>
                </DialogActions>
            </Dialog>
        </MainLayout>
    );
};

export default Login;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;

    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 400px;
    }
`;
const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 48px;
    
    ${({ theme }) => theme.breakpoints.down("tablet")} {
        padding: 0 20px;
        box-sizing: border-box;
    }
`;
const TextFieldWrapper = styled.div`
    display: flex;
    width: 100%;
    min-height: 68px;
`;