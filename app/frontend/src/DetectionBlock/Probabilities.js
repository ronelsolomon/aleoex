import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import diseaseColorMap from './DiseaseMap';

const useStyles = makeStyles((theme) => ({
    root: {
      padding: 32,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      overflowY: 'auto',
      maxHeight: "calc(50vh - 100px)",
      minHeight: "400px"
    },
    subtitle: {
      flexGrow: 1,
      color: "#69B3C7",
      fontFamily: "Lora",
      marginBottom: 16
    },
    textbox: {
        fontFamily: "Roboto",
        marginBottom: 8
    },
    button: {
        backgroundColor: "white",
        color: "gray",
        fontWeight: "bold",
        fontFamily: "Source Sans Pro",
    },
    metadata: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
    }
  }));

export default function Probabilities(props) {
    const classes = useStyles();
    const {output, outputViewState, setOutputViewState} = props;
    const probabilities = output;

    return (
        <div className={classes.root}>
            <Typography variant="h6" style={{
                color: "#69B3C7", marginBottom: 16,
                borderBottom: "solid #69B3C7",
                paddingBottom: 8
            }}>
                Detected Abnormalities
            </Typography>
            {
                probabilities.map((val, index) => {
                    return (
                        <Accordion key={index} style={{
                            width: "100%"
                        }} 
                         expanded={outputViewState.viewFileName === val['fileName']}
                         onChange={() => {
                            if (outputViewState.viewFileName === val['fileName']) {
                                setOutputViewState((prevState) => {
                                    return {
                                        ...prevState,
                                        viewFileName: null,
                                        viewDisease: null,
                                        viewOriginal: false,
                                        hiddenDiseases: []
                                    }
                                });
                            } else {
                                setOutputViewState((prevState) => {
                                    return {
                                        ...prevState,
                                        viewFileName: val['fileName'],
                                        viewDisease: null,
                                        viewOriginal: false,
                                        hiddenDiseases: []
                                    }
                                });
                            }
                         }}
                        >
                            <AccordionSummary
                             expandIcon={<ExpandMoreIcon />}
                             >
                                {val['fileName']}
                            </AccordionSummary>
                            <AccordionDetails style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start'
                            }}>
                                {
                                    Object.entries(val['detections']).map(([k, v], i) => {
                                        return (
                                            <div key={i} style={{
                                                marginBottom: 8,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start',
                                                width: "95%"
                                            }}>
                                                <div style={{
                                                    width: "100%",
                                                    borderLeft: `solid ${diseaseColorMap[k]}`,
                                                    paddingLeft: 8, 
                                                    display: 'flex', 
                                                    flexDirection: 'row', justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    {k}
                                                    <Button className={classes.button} variant="outlined" 
                                                     onClick={() => setOutputViewState((prevState) => {
                                                        if (outputViewState.hiddenDiseases.includes(k)) {
                                                            return {
                                                                ...prevState,
                                                                hiddenDiseases: prevState.hiddenDiseases.filter(
                                                                    d => d !== k
                                                                )
                                                            }
                                                        }
                                                        return {
                                                            ...prevState,
                                                            hiddenDiseases: [...prevState.hiddenDiseases, k]
                                                        }
                                                     })}>
                                                        {outputViewState.hiddenDiseases.includes(k) ? 
                                                         'Show' : 'Hide'}
                                                    </Button>
                                                </div>
                                                <ol>
                                                {
                                                    v.map((vi, j) => {
                                                        return (
                                                            <li key={j} style={{textAlign: 'start', marginBottom: 8}}>
                                                                {`Confidence: ${(vi.p).toFixed(2)}`}<br/>
                                                                {`Bbox: x=${vi.x}, y=${vi.y}, w=${vi.w}, h=${vi.h}`}
                                                            </li>
                                                        )
                                                    })
                                                }
                                                </ol>
                                            </div>
                                        )
                                    })
                                }
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </div>
      );
}