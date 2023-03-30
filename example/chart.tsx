import React from 'react';
import styled from 'styled-components';
import SiriusChart from '../src/components/SiriusChart';

const Wrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;/
`

const ChartDoc: React.FC = () => {
    const threshold = {
        'alert': 0.1,
        'alarm': 0.14
    }

    return (
        <Wrapper>
            <SiriusChart
                pv_name={['RAD:Thermo1:Gamma', 'RAD:Thermo2:Gamma', 'RAD:Thermo3:Gamma', 'RAD:Thermo4:Gamma']}
                threshold={threshold}
                configOptions={function (options: Chart.ChartOptions, pv_name: string | string[]) {return options}}/>
        </Wrapper>
    )
}

export default ChartDoc;
