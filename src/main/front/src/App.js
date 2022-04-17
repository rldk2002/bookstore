import React from "react";
import { QueryClient, QueryClientProvider, useQueryErrorResetBoundary } from "react-query";
import ErrorPage from "./pages/error/ErrorPage";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import theme from "./styles/theme";
import { Flip, ToastContainer } from "react-toastify";
import AppRoute from "./AppRoute";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { combineReducers, createStore } from "redux";
import bookCartCheckedList from "./redux/bookCartCheckedList";
import { Provider } from "react-redux";

const rootReducer = combineReducers({
    bookCartCheckedList
});
const store = createStore(rootReducer);

const App = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
                cacheTime: 1000 * 60 * 30,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                useErrorBoundary: true
            },
            mutations: {
                retry: false,
                useErrorBoundary: true
            }
        }
    });
    
    const { reset } = useQueryErrorResetBoundary();
    
    return (
        <Provider store={ store }>
            <QueryClientProvider client={ queryClient }>
                <ErrorBoundary
                    onReset={ reset }
                    fallbackRender={ ({ error }) => <ErrorPage error={ error } /> }
                >
                    <BrowserRouter>
                        <GlobalStyle />
                        <StyledComponentsThemeProvider theme={ theme }>
                            <MuiThemeProvider theme={ theme }>
                                <AppRoute />
                                <ToastContainer
                                    autoClose={ 500 }
                                    hideProgressBar
                                    transition={ Flip }
                                />
                            </MuiThemeProvider>
                        </StyledComponentsThemeProvider>
                    </BrowserRouter>
                </ErrorBoundary>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
