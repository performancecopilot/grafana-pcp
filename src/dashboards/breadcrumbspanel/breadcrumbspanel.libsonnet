{
  new(
    title='',
    datasource=null,
    items=[],
  )::{
    title: title,
    type: 'pcp-breadcrumbs-panel',
    datasource: datasource,
    options: {
      items: items,
    },
    addItem(item):: self {
      options+: {
        items+: [item]
      },
    },
    addItems(items):: std.foldl(function(b, item) b.addItem(item), items, self),
  },
}
