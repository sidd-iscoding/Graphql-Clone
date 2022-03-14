import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Card, Container} from "@material-ui/core";
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'


import { useState, useEffect } from "react";
import {
  Grid,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from "@material-ui/core";

function Body(props) {
  const { children, value, index, ...other } = props;

  const [url, setUrl] = useState(() => {
    // getting stored value
    const saved = sessionStorage.getItem("url");
    const initialValue = JSON.parse(saved);
    return initialValue || "http://localhost:5000";
  });

  const [inputBox, setInputBox] = useState(() => {
    // getting stored value
    const saved = sessionStorage.getItem("inputBox");
    const initialValue = JSON.parse(saved);
    return initialValue || " ";
  });
  const [outBox, setOutBox] = useState(() => {
    // getting stored value
    const saved = sessionStorage.getItem("outBox");
    const initialValue = JSON.parse(saved);
    return initialValue || " ";
  });

  useEffect(() => {
    // storing input name
    sessionStorage.setItem("url", JSON.stringify(url));
  }, [url]);
  useEffect(() => {
    // storing input name
    sessionStorage.setItem("inputBox", JSON.stringify(inputBox));
  }, [inputBox]);
  useEffect(() => {
    // storing input name
    sessionStorage.setItem("outBox", JSON.stringify(outBox));
  }, [outBox]);

  const handleTextChange = (e) => {
    console.log(e.target.value);
    setUrl(e.target.value);
  };

  const handleSubmit = () => {
    console.log(inputBox);
    loadQuery();
  };
  
  async function loadQuery() {
    const query = inputBox;
    console.log(query);
    const response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    const re = JSON.stringify(result,null,' ');
    console.log(result);

    setOutBox(re);
    console.log(outBox);
  }

  
  const curl = `curl '${url}' -H 'Accept-Encoding: gzip, deflate, br' -H
  'Content-Type:  -H 'Accept: application/json' -H 'Connection:keep-alive'
  -H 'DNT: 1' -H 'Origin: ${url}' --data-binary '{"query":"query {\nꂠabout\
  n}\n"}' –compressed
  {"data":{"about":"Hello World!"}}`;

  function copyCurl(){
    console.log(curl);

    var copyText = curl;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    
  }

  return (
    <div
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 0,
            border: 1,
            position: "absolute",
            left: 0,
            right: 4,
            height: "100%",
          
          }}
         
        >
          <Typography component={"div"}>
            <TextField
              fullWidth
              label="url"
              id="fullWidth"
              variant="outlined"
              onChange={(e) => handleTextChange(e)}
              value={url}
              placeholder="http://localhost/5000"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={copyCurl }
                      variant="contained"
                      color="primary"
                      style={{ fontSize: 10 }}
                    >
                      Copy Curl
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={2}>
              <Grid item lg={6} sm={6} md={6} xs={12}>
                <CodeMirror
                  id="myText"
                  value={inputBox}
                  onBeforeChange={(editor, data, inputBox) => {
                    setInputBox(inputBox);
                  }}
                  options={{
                    lineNumbers: true,
                    lineWrapping: true,
                    theme: "material",
                    mode: "graphql",
                  }}
                />
              </Grid>
              <Grid item lg={6} sm={6} md={6} xs={12} sx={{ border: 1,bordercolor:"blue", height:300}}>
                  
                  <CodeMirror
                 
                  value={outBox}
                  onBeforeChange={(editor, data, inputBox) => {
                    setInputBox(inputBox);
                  }}
                  options={{
                    
                    lineWrapping: true,
                    theme: "material",
                    mode: "javascript",
                    cursorBlinkRate: -100
                  }}
                />
              
              </Grid>

              <Card variant="outlined"  style={{Border: 4,backgroundColor: "grey",  width:200, height:"100"}}>
            <Button style={{position:'absolute',top: "50%", right: "48%"}} onClick={handleSubmit} variant="contained" color="primary">
                        Run
                      </Button>     

            </Card>
            </Grid>  
           
           
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default Body;