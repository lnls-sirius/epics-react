import EpicsBase from "../controllers/epics_con";

describe('Epics Base Class', () => {
  const base_threshold = {
    'alert': 1,
    'random': 0.5,
    'alarm': 2
  }
  const pv1 = "FAKE:PV";
  const pv_list = ["FAKE:PV", "FAKE:PV2"];
  const epics_base = new EpicsBase<string>(pv1);
  const epics_base2 = new EpicsBase<string[]>(pv_list);

  it("Initialization working", () => {
    epics_base.initialize(
      pv1, base_threshold, 100);
    epics_base2.initialize(
      pv_list, base_threshold, 100);

    expect(epics_base.pv_name).toEqual(pv1);
    expect(epics_base2.pv_name).toEqual(pv_list);
    expect(epics_base.pv_name).toEqual(pv1);
    expect(epics_base.thresholds).toEqual({
      "thr_arr": [
        ["alarm", 2],
        ["alert", 1],
        ["random", 0.5]
      ],
      "thr_dict": {
        'alert': 1,
        'random': 0.5,
        'alarm': 2
      }});
  });

  it("Set pv name function is working", () => {
    const pv1_2 = "NEW:FAKE:PV";
    epics_base.set_pvname(pv1_2);
    expect(epics_base.pv_name).toEqual(pv1_2);
  });

  it("Get Threshold Function is working", () => {
    expect(epics_base.get_threshold(0.25)).toEqual('normal');
    expect(epics_base.get_threshold(0.5)).toEqual('random');
    expect(epics_base.get_threshold(0.99)).toEqual('random');
    expect(epics_base.get_threshold(1)).toEqual('alert');
    expect(epics_base.get_threshold(1.72)).toEqual('alert');
    expect(epics_base.get_threshold(2)).toEqual('alarm');
    expect(epics_base.get_threshold(123)).toEqual('alarm');
  });
})
