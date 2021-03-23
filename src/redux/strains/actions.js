const actions = {
  GET_STRAINSLIST: "GET_STRAINSLIST",
  STRAINSLIST_RECEIVED: "STRAINSLIST_RECEIVED",
  GET_PHYLOGENY: "GET_PHYLOGENY",
  PHYLOGENY_RECEIVED: "PHYLOGENY_RECEIVED",
  GET_PCADATA: "GET_PCADATA",
  PCADATA_RECEIVED: "PCADATA_RECEIVED",
  GET_ANATOMY: "GET_ANATOMY",
  ANATOMY_RECEIVED: "ANATOMY_RECEIVED",
  getStrainsList: (file) => ({
    type: actions.GET_STRAINSLIST,
    file: file
  }),
  getPhylogeny: (file) => ({
    type: actions.GET_PHYLOGENY,
    file: file
  }),
  getPcaData: (file) => ({
    type: actions.GET_PCADATA,
    file: file
  }),
  getAnatomy: (file) => ({
    type: actions.GET_ANATOMY,
    file: file
  })
};

export default actions;