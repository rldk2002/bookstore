import React, { useState } from 'react';
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Link, Stack, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useLogin } from "../../api/queries";
import { useQueryClient } from "react-query";
import MainLayout from "../../components/layout/MainLayout";
import { Home } from "@mui/icons-material";
import BasicBreadcrumbs from "../../components/BasicBreadcrumbs";


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const [failMessage, setFailMessage] = useState('');	// 로그인 실패 원인 메세지
    
    const schema = yup.object().shape({
        id: yup.string().required("아이디를 입력하세요."),
        password: yup.string().required("비밀번호를 입력하세요.")
    });
    const { register, handleSubmit } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit",
        resolver: yupResolver(schema)
    });
    const { mutateAsync: mutateAsyncLogin, isLoading } = useLogin();
    const handleValid = async form => {
        await mutateAsyncLogin(form, {
            onSuccess: response => {
                const { code, content } = response;
                if (code?.startsWith("401-")) {
                    setFailMessage(content);
                }
                else {
                    queryClient.invalidateQueries({
                        predicate: ({ queryKey }) => queryKey.find(key => key === 'principal')
                    }).finally(() => {
                            const previousPage = location.state?.from;
                            if (previousPage) {
                                navigate(previousPage, { replace: true });
                            } else {
                                navigate("/", { replace: true });
                            }
                        }
                    )
                }
            }
        })
    };
    
    const breadcrumbs = [
        <Link underline="hover" key="1" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}><Home sx={{ pr: 1 }} /> Home</Link>,
        <Typography key="3" color="text.primary">로그인</Typography>,
    ];
    
    return (
        <MainLayout>
            <BasicBreadcrumbs breadcrumbs={ breadcrumbs } />
            <Wrapper>
                <Logo>
                    <Link href="/" underline="hover" color="inherit">BookStore</Link>
                </Logo>
                <LoginForm onSubmit={ handleSubmit(handleValid) }>
                    <Stack>
                        <TextField
                            label="아이디"
                            variant="outlined"
                            autoComplete="off"
                            margin="normal"
                            fullWidth
                            required
                            { ...register("id") }
                        />
                        <TextField
                            label="비밀번호"
                            variant="outlined"
                            type="password"
                            autoComplete="off"
                            margin="normal"
                            fullWidth
                            required
                            { ...register("password") }
                        />
                        { failMessage && <Alert severity="error">{ failMessage }</Alert> }
                        <ButtonField>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={ isLoading }
                                fullWidth
                            >
                                로그인
                            </LoadingButton>
                        </ButtonField>
                    </Stack>
                </LoginForm>
                <Link href="/signup" underline="hover" color="inherit">회원가입</Link>
            </Wrapper>
        </MainLayout>
    );
};

export default Login;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	
    ${ ({ theme }) => theme.breakpoints.up('tablet') } {
        width: 400px;
    }
`;
const Logo = styled.div`
    margin: 40px 0;
	font-size: 24px;
	font-weight: bold;
`;
const LoginForm = styled.form`
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