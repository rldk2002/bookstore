import React from 'react';
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import { Reset } from 'styled-reset';
import { ThemeProvider as StyledComponentThemeProvider } from "styled-components";
import { ThemeProvider as MuiStyleThemeProvider } from "@mui/material";
import { RecoilRoot } from "recoil";
import theme from "./styles/theme";
import AppRoutes from "./AppRoutes";
import Errors from "./pages/errors/Errors";
import { ToastContainer } from "react-toastify";

function App() {
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
                fallbackRender={({ error }) => <Errors error={ error } />}
            >
                <BrowserRouter>
                    <Reset />
                    <StyledComponentThemeProvider theme={ theme }>
                        <MuiStyleThemeProvider theme={ theme }>
                            <RecoilRoot>
                                <AppRoutes />
                                <ToastContainer // Snackbar
                                    position="bottom-right"
                                    autoClose={ 1500 }
                                    hideProgressBar={ true }
                                    newestOnTop={ false }
                                    closeOnClick
                                    rtl={ false }
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                />
                            </RecoilRoot>
                        </MuiStyleThemeProvider>
                    </StyledComponentThemeProvider>
                </BrowserRouter>
            </ErrorBoundary>
        </QueryClientProvider>
    );
}

export default App;
