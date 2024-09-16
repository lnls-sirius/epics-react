import React, { useState } from 'react';
import styled from 'styled-components';
import SiriusChart from '../src/components/SiriusChart';

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;/
`


const ChartDoc: React.FC = () => {
    const [pvs, setPVs] = useState<string[]>([]);

    const threshold = {
        'alert': 0.5,
        'alarm': 0.6
    }

    function handleMod(value: any, pvname: string[] | undefined): any {
        return value+0.1
    }

    function handleOptions(options: any, pv_name: string[]|undefined): any {
        return options;
      }

    return (
        <Wrapper>
            <button onClick={()=> setPVs([
                '#ff0109', '#ff01ff', '#55dd01', '#b3a912'])}>
                    ADD PVs
            </button>
            <SiriusChart
                pv_name={["RAD:Thermo1:TotalDoseRate:Dose",
                    "RAD:ELSE:TotalDoseRate:Dose", "RAD:Thermo1:TotalDoseRate:Dose",
                    "RAD:ELSE:TotalDoseRate:Dose"]}
                label={[['SI','MI'], 'SO', 'RAD', 'SWC']}
                color_label={pvs}
                threshold={threshold}
                modifyOptions={handleOptions}
                modifyValue={handleMod}/>
        </Wrapper>
    )
}

export default ChartDoc;
