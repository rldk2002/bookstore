import React, { useState } from 'react';
import EmptyLayout from "../../components/layout/EmptyLayout";
import styled from "styled-components";
import { device } from "../../styles/device";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, TextField } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useLoginJWT } from "../../api/queries";
import { useQueryClient } from "react-query";


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
    const { mutateAsync: mutateAsyncLogin, isLoading } = useLoginJWT();
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
    
    return (
        <EmptyLayout>
            <Wrapper>
                <Logo>
                    <Link to="/">BookStore</Link>
                </Logo>
                <LoginForm onSubmit={ handleSubmit(handleValid) }>
                    <FormField>
                        <TextField
                            label="아이디"
                            variant="outlined"
                            autoComplete="off"
                            fullWidth
                            required
                            { ...register("id") }
                        />
                    </FormField>
                    <FormField>
                        <TextField
                            label="비밀번호"
                            variant="outlined"
                            type="password"
                            autoComplete="off"
                            fullWidth
                            required
                            { ...register("password") }
                        />
                    </FormField>
                    <FormField>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            size="large"
                            loading={ isLoading }
                            fullWidth
                        >
                            로그인
                        </LoadingButton>
                    </FormField>
                    { failMessage && <Alert severity="error">{ failMessage }</Alert> }
                </LoginForm>
            </Wrapper>
        </EmptyLayout>
    );
};

export default Login;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	
    @media ${ device.tablet } {
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
const FormField = styled.div`
    width: 100%;
    margin-bottom: 20px;
`;