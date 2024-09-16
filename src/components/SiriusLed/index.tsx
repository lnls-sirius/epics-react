import React, { useState, useEffect } from "react";
import EpicsBase from "../../controllers/epics_base";
import SiriusTooltip from "../SiriusTooltip";
import { LedPv, EpicsData, Dict } from "../../assets/interfaces";
import { default_colors, led_shape } from "../../assets/themes";
import * as S from './styled';

/**
 * Default Led component for monitoring a PV from the EPICS control system.
 */
const SiriusLed: React.FC<LedPv> = (props) => {
  const epics: EpicsBase<string> = new EpicsBase<string>(props.pv_name);
  const [colorList, setColorList] = useState<Dict<string>>({});
  const [state, setState] = useState<string>('nc');

  useEffect(() => {
    const timerId = initialize_epics_base();
    setColorList(initialize_led_style());
    return () => {
      epics.stop_timer(timerId);
    };
  }, [props]);

  useEffect(() => () => {
    epics.destroy();
  }, []);

  const initialize_epics_base = (): NodeJS.Timer => {
    const { pv_name, threshold, update_interval } = props;
    epics.initialize(pv_name, threshold, update_interval);
    epics.reset_last_update();
    const timerId = epics.start_timer(updateLed);
    return timerId
  }

  /**
   * Add normal and nc (Not connected) colors to the color dictionary
   * if they are not declared.
   */
  const handle_default_color = (color: Dict<string>): Dict<string> => {
    if(!('nc' in color)){
      color["nc"] = default_colors.led["nc"];
    }
    if(!('normal' in color)){
      color["normal"] = default_colors.led["normal"];
    }
    return color;
  }

  const initialize_led_style = (): Dict<string> => {
    const { color } = props;
    if(color !== undefined)
      return handle_default_color(color);
    return default_colors.led;
  }

  /**
   * Check if the time since the last PV update is greater than
   * the disconnect time parameter value.
   */
  const check_disconnected = (disc_time: number, update_date: Date|null, led_value: string): string => {
    if(update_date === null)
      return "nc";
    const update_time: number = update_date.getTime();
    const now_ms: number = (new Date()).getTime();
    let time_since_update: number = now_ms - update_time;
    if(time_since_update >= disc_time)
      return "nc";
    return led_value;
  }

  /**
   * Update led color with measured EPICS value
   */
  const updateLed = (): void => {
    const { disc_time, pv_name, modifyValue } = props;
    let led_value: string = "nc";
    if(!epics)
      return;

    let pvData: Dict<EpicsData<number>> = epics.get_pv_data<number>();
    const pvInfo: EpicsData<number> = pvData[pv_name];
    if(!pvInfo){
      return;
    }

    const invalidValue: boolean = ((!state) || (pvInfo.value === null));
    if(invalidValue){
      if(!disc_time)
        return;
      led_value = check_disconnected(disc_time, epics.last_update, "normal");
      setState(led_value);
      return;
    }

    led_value = epics.get_threshold(Number(pvInfo.value));
    if(modifyValue!=undefined)
      led_value = modifyValue<string>(led_value, pv_name);
    if(disc_time)
      led_value = check_disconnected(disc_time, pvInfo.date, led_value);
    epics.update_last_update(pvInfo.date);
    setState(led_value);
  }


  return (
    <SiriusTooltip text={props.pv_name}>
      <S.LedWrapper
        shape={led_shape[props.shape]}
        color={colorList[state]}
        data-testid="sirius-led"/>
    </SiriusTooltip>
  );
}

export default SiriusLed;
