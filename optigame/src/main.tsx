import * as React from 'react'
import { Provider } from "./components/ui/provider";
import * as ReactDOM from 'react-dom/client'
import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
)