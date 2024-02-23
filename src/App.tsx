import React, { useState } from 'react'
import { Box, Stack, Theme, ThemeProvider } from '@mui/material'
import { muiDarkSiteTheme, muiLightSiteTheme } from './theme/muiTheme'
import { HtmlEditor } from './HtmlEditor/HtmlEditor'
import { Route, Routes } from 'react-router-dom'
import { Button } from './components/buttons/Button/Button'
import { TestPages } from './HtmlEditor/ComponentsTest'

function App() {
  const [Theme, setTheme] = useState<Theme>(muiDarkSiteTheme)

  const toggleTheme = () => {
    setTheme((current) =>
      current === muiDarkSiteTheme ? muiLightSiteTheme : muiDarkSiteTheme
    )
  }

  return (
    <ThemeProvider theme={Theme}>
      <Routes>
        <Route path="/" element={<HtmlEditor />} />
        <Route path="/test" element={<TestPages />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
