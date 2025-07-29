import './App.css'
import Layout from "./components/layouts/Layout.tsx";
import {BrowserRouter} from "react-router-dom";
import Router from "./components/routers/Router.tsx";

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
