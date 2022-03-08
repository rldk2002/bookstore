import React from "react";
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import ErrorPage from "./pages/error/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";
import { Flip, ToastContainer } from "react-toastify";
import AppRoute from "./AppRoute";


const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
                cacheTime: 1000 * 60 * 30,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                useErrorBoundary: false
            },
            mutations: {
                retry: false,
                useErrorBoundary: true
            }
        }
    });
    const { reset } = useQueryErrorResetBoundary();
    
    return (
        <QueryClientProvider client={ queryClient }>
            <ErrorBoundary
                onReset={ reset }
                fallbackRender={ ({ error }) => <ErrorPage error={ error } /> }
            >
                <BrowserRouter>
                    <GlobalStyle />
                    <ThemeProvider theme={ theme }>
                        <AppRoute />
                        <ToastContainer
                            autoClose={ 500 }
                            hideProgressBar
                            transition={ Flip }
                        />
                    </ThemeProvider>
                </BrowserRouter>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
