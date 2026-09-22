import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/Layout/layout/layout'
import './index.css'
import { interceptor } from './utils/interceptor'
import { Provider } from 'react-redux'
import { store } from './redux/store'


interceptor.create();

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
        <Provider store={store} >
            <Layout />
        </Provider>

    </BrowserRouter>

)
