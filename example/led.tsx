import React, { useState } from 'react';
import styled from 'styled-components';
import SiriusLed from '../src/components/SiriusLed';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 10%);
  text-align: center;
  align-items: center;
  justify-content: space-between;/
`

const LedDoc: React.FC = () => {
    const [state, setState] = useState<boolean>(false);
    const threshold1 = {
        'alert': 0.4,
        'alarm': 0.06
    }

    const threshold2 = {
        'alert': 0.1,
        'som': 0.108,
        'alarm': 0.105
    }

    const threshold3 = {
        'alert': 0.5,
        'alarm': 0.7
    }

    const color1 = {
        'alert': 'radial-gradient(#f8ff1b, #a29800)',
        'som': '#000000',
        'alarm': 'radial-gradient(#ff1b1b, #a20000)'
    }

    const color2 = {
        'alert': 'radial-gradient(#ff1b1b, #a200ff)',
        'som': '#ffffff',
        'alarm': 'radial-gradient(#f8ff1b, #ff98ff)'
    }

    return (
        <div>
            <button onClick={()=>{setState(!state)}}>Change Led Colors</button>
            <Wrapper>
                Square led (square): <SiriusLed pv_name={state?"SI-01BCFE:VA-CCG-MD:Pressure-Mon":"SI-01SA:VA-CCG-BG:Pressure-Mon"} shape={'square'} threshold={threshold1} disc_time={60000}/>
                Square with round borders(squ_circ): <SiriusLed pv_name="SI-02C3:VA-CCG-BG:Pressure-Mon" shape={'squ_circ'}
                    threshold={state?threshold1:threshold2} color={state?color1:color2}/>
                Circle led (circle): <SiriusLed pv_name="SI-02C3:VA-CCG-BG:Pressure-Mon" shape={'circle'} threshold={threshold3} disc_time={60000}/>
                Led with disconnection handler: <SiriusLed pv_name={state?"SI-02C3:VA-CCG-BG:Pressure-Mon":"RAD:Thermo1:Gamma"} shape={'circle'} disc_time={2000}/>
            </Wrapper>
        </div>
    )
}

export default LedDoc;
