import './App.css'
import Layout from "./shared/components/layouts/Layout.tsx";
import {BrowserRouter} from "react-router-dom";
import Router from "./shared/routers/Router";

function App() {

    return (
        <>
            <BrowserRouter>
                <Layout>
                    <Router/>
                </Layout>
            </BrowserRouter>
        </>
    )
}

export default App
