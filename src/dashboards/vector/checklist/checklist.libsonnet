local breadcrumbsPanel = import '_breadcrumbspanel.libsonnet';
local grafana = import 'grafonnet/grafana.libsonnet';

{
  /**
   * Tag that is shared across all checklist dashboards
   */
  tags: ['pcp-vector', 'pcp-checklist'],

  /**
   * Nodes representing checklist dashboard tree - linking related dashboards (which contain related panels) together.
   * This tree is a main source of truth for all dashboard related information
   * in all DASHBOARDS_DIR/overview dashboards. With its help, breadcrumb navigation gets easily generated.
   * Inter-dashbaord navigation from panels is not though as this tree doesn't
   * capture panel->dashboard relationship, only dashboard->dashboard.
   * In a case of updating tree structure make sure that panels link correctly.
   *
   * A node is represented by
   * @param title Title of a dashboard - this gets shown in all Grafana native related listings, when managing dashboards, etc.
   * @param name Name of a dashboard - this gets shown when presenting dashboard name in modals and breadcrumbs of other checklist dashboards
   * @param uid Unique identifier of the dashboard
   * @param parents Single(!) parent node uid
   */
  nodes: [
    {
      uid: 'pcp-vector-checklist',
      title: 'PCP Vector Checklist',
      name: 'Overview',
      parents: [],
    },
    {
      uid: 'pcp-vector-checklist-cpu',
      title: 'PCP Vector Checklist: CPU',
      name: 'CPU',
      parents: ['pcp-vector-checklist'],
    },
    {
      uid: 'pcp-vector-checklist-cpu-sys',
      title: 'PCP Vector Checklist: System CPU',
      name: 'System CPU',
      parents: ['pcp-vector-checklist-cpu'],
    },
    {
      uid: 'pcp-vector-checklist-cpu-user',
      title: 'PCP Vector Checklist: User CPU',
      name: 'User CPU',
      parents: ['pcp-vector-checklist-cpu'],
    },
    {
      title: 'PCP Vector Checklist: Memory',
      name: 'Memory',
      uid: 'pcp-vector-checklist-memory',
      parents: ['pcp-vector-checklist'],
    },
    {
      uid: 'pcp-vector-checklist-memory-swap',
      title: 'PCP Vector Checklist: Swap Memory',
      name: 'Swap Memory',
      parents: ['pcp-vector-checklist-memory'],
    },
    {
      uid: 'pcp-vector-checklist-storage',
      title: 'PCP Vector Checklist: Storage',
      name: 'Storage',
      parents: ['pcp-vector-checklist'],
    },
    {
      uid: 'pcp-vector-checklist-network',
      title: 'PCP Vector Checklist: Network',
      name: 'Network',
      parents: ['pcp-vector-checklist'],
    },
    {
      uid: 'pcp-vector-checklist-network-rx',
      title: 'PCP Vector Checklist: Network RX',
      name: 'Network RX',
      parents: ['pcp-vector-checklist-network'],
    },
    {
      uid: 'pcp-vector-checklist-network-tx',
      title: 'PCP Vector Checklist: Network TX',
      name: 'Network TX',
      parents: ['pcp-vector-checklist-network'],
    },
  ],

  /**
   * Gets a node by given *uid* from a *nodeCollection* with default being a tree represented in 'nodes' field
   *
   * @param uid
   * @param nodeCollection
   */
  getNodeByUid(uid, nodeCollection=self.nodes)::
    local result = std.filter(function(x) x.uid == uid, nodeCollection);
    if std.length(result) == 0 then {} else result[0],

  /**
   * Plucks 'parents' field from given node
   *
   * @param node
   */
  pluckParents(node)::
    {
      title: node.title,
      uid: node.uid,
      name: node.name,
      [if std.objectHas(node, 'active') then 'active']: node.active,
      [if std.objectHas(node, 'current') then 'current']: node.current,
    },

  /**
   * Returns all nodes from 'nodes' field with same parent as given *node*
   *
   * @param node
   * @param includeNode Include passed node
   */
  getSiblingNodes(node, includeNode=true)::
    std.filter(
      function(x)
        x.parents == node.parents &&
        x.uid != node.uid,
      self.nodes
    ) + if includeNode then [node] else [],

  /**
   * Returns all parent nodes from 'nodes' field which have given *node* as a child
   *
   * @param node
   * @param deep Recurse up to a parent-less (root) node
   */
  getParentNodes(node, deep=false)::
    local parents = std.filter(
      function(x)
        std.member(
          node.parents,
          x.uid
        ),
      self.nodes
    );
    if std.length(parents) == 0 then
      []
    else
      if deep then
        std.flatMap(
          function(x)
            self.getParentNodes(x, deep=true),
          parents
        ) + [parents]
      else
        parents,

  /**
   * Returns all direct children nodes from 'nodes' field of a given *node*
   *
   * @param node
   */
  getChildrenNodes(node)::
    std.map(
      self.pluckParents,
      std.filter(
        function(x) std.member(x.parents, node.uid),
        self.nodes
      )
    ),

  /**
   * Returns all nodes (including self) on the way up to a root of nodes from 'nodes' field beginning with *node*
   *
   * @param node
   * @param includeSiblings Also return siblings of all depth levels traversed on the way to root
   * @param markPath Mark nodes traversed with field 'active', set to true
   */
  getPathToRoot(node, includeSiblings=false, markPath=true)::
    std.map(
      function(node_list)
        std.map(
          self.pluckParents,
          node_list
        ),
      std.flatMap(
        if includeSiblings then
          function(node_list)
            std.map(
              function(target_node)
                self.getSiblingNodes(
                  target_node
                  {
                    [if markPath then 'active']: true,
                  }
                ),
              node_list
            )
        else
          function(node_list)
            [node_list],
        self.getParentNodes(node, deep=true) + [[node]],
      )
    ),

  /**
   * Returns all possible navigation items for a given node. That is:
   * - all parents (and their siblings) of *node* (up to the root), with traversed path marked
   * - all children of *node*
   * Used for fetching breadcrumbs navigation
   *
   * @param node Node of origin
   * @param markSelf Mark provided node with current attribute
   */
  getNavigation(node, markSelf=true)::
    local origin = if markSelf then node { current: true } else node;
    local pathToRoot = self.getPathToRoot(origin, includeSiblings=true, markPath=true);
    local children = self.getChildrenNodes(origin);
    if std.length(children) == 0 then
      pathToRoot
    else
      pathToRoot + [children],

  dashboard: {
    new(node)::
      grafana.dashboard.new(
        node.title,
        uid=node.uid,
        tags=$.tags,
        time_from='now-5m',
        time_to='now',
        refresh='1s',
        timepicker=grafana.timepicker.new(
          refresh_intervals=['1s', '2s', '5s', '10s'],
        )
      )
      .addTemplate(
        grafana.template.datasource(
          'datasource',
          'pcp-vector-datasource',
          'PCP Vector',
        )
      )
      .addTemplate(
        grafana.template.text(
          'url',
          label='URL',
        ) + {
          description: 'overwrite pmproxy URL (example: http://127.0.0.1:44322)',
        }
      )
      .addTemplate(
        grafana.template.text(
          'hostspec',
        ) + {
          description: 'overwrite PCP host specification (example: pcp://127.0.0.1:44321)',
        }
      )
      .addPanel(
        breadcrumbsPanel.new()
        .addItems($.getNavigation(node)), gridPos={
          x: 0,
          y: 0,
          w: 24,
          h: 2,
        },
      ),
  },
}
