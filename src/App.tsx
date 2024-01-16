import { useState } from "react";
import { Theme, ThemeProvider } from "@mui/material";
import { muiDarkSiteTheme, muiLightSiteTheme } from "./theme/muiTheme";
import { HtmlEditor } from "./HtmlEditor/HtmlEditor";

function App() {
  const [Theme, setTheme] = useState<Theme>(muiDarkSiteTheme);

  const toggleTheme = () => {
    setTheme((current) =>
      current === muiDarkSiteTheme ? muiLightSiteTheme : muiDarkSiteTheme
    );
  };

  return (
    <ThemeProvider theme={Theme}>
      <HtmlEditor />
    </ThemeProvider>
  );
}

export default App;
