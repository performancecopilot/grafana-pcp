{
  /**
   * Returns a new breadcrumbs panel that can be added in a row
   *
   * @name breadcrumbsPanel.new
   *
   * @param title The title of the panel, preferably empty, so it stays transparent
   * @param items List of lists of tree nodes from 'nodes' field, located in DASHBOARD_DIR/overview/shared.libsonnet (preferably retrieved by *getNavigation* or *getNodeByUid* function from same file), representing dashboards. Each list represents single level of depth within the tree of navigation items that will be rendered. When multiple items are present in a depth, select UI is used, when single item is present, link is used.
   * 
   * @func addItem chainable declarative addition of *items*
   * @func addItems
   *
   * ---
   * Is not intended for use in user's dashboards
   */
  new(
    title='',
    items=[],
  )::{
    title: title,
    type: 'pcp-breadcrumbs-panel',
    options: {
      items: items,
      // marks the dashboard as 'scripted', therefore, not user created
      scripted: true,
    },
    addItem(item):: self {
      options+: {
        items+: [item]
      },
    },
    addItems(items):: std.foldl(function(b, item) b.addItem(item), items, self),
  },
}
