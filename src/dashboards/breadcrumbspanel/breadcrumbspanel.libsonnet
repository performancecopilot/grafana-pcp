{
  breadcrumbs: {
    new(
      title,
      datasource,
      items=[],
    )::{
      title: title,
      type: 'pcp-breadcrumbs-panel',
      datasource: datasource,
      options: {
        items: items,
      },
    },
  },
}