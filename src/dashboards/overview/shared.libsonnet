// altrough there is 'parents' field in each node, only singular parent is supported - this is a tree representation after all
{
  tag: 'pcp-checklist',
  nodes: [
    {
      title: 'PCP Vector Checklist: Overview',
      name: 'Overview',
      uid: 'pcp-overview',
      parents: [],
    },
    {
      title: 'PCP Vector Checklist: CPU',
      name: 'CPU',
      uid: 'pcp-cpu-overview',
      parents: ['pcp-overview'],
    },
    {
      title: 'PCP Vector Checklist: System CPU',
      name: 'System CPU',
      uid: 'pcp-cpu-sys-overview',
      parents: ['pcp-cpu-overview'],
    },
    {
      title: 'PCP Vector Checklist: User CPU',
      name: 'User CPU',
      uid: 'pcp-cpu-user-overview',
      parents: ['pcp-cpu-overview'],
    },
    {
      title: 'PCP Vector Checklist: Memory',
      name: 'Memory',
      uid: 'pcp-memory-overview',
      parents: ['pcp-overview'],
    },
    {
      title: 'PCP Vector Checklist: Swap Memory',
      name: 'Swap Memory',
      uid: 'pcp-memory-swap-overview',
      parents: ['pcp-memory-overview'],
    },
    {
      title: 'PCP Vector Checklist: Storage',
      name: 'Storage',
      uid: 'pcp-storage-overview',
      parents: ['pcp-overview'],
    },
    {
      title: 'PCP Vector Checklist: Network',
      name: 'Network',
      uid: 'pcp-network-overview',
      parents: ['pcp-overview'],
    },
    {
      title: 'PCP Vector Checklist: Network RX',
      name: 'Network RX',
      uid: 'pcp-network-rx-overview',
      parents: ['pcp-network-overview'],
    },
    {
      title: 'PCP Vector Checklist: Network TX',
      name: 'Network TX',
      uid: 'pcp-network-tx-overview',
      parents: ['pcp-network-overview'],
    },
  ],
  getNodeByUid(uid, nodeCollection=self.nodes)::
    local result = std.filter(function(x) x.uid == uid, nodeCollection);
    if std.length(result) == 0 then {} else result[0],
  pluckParents(node)::
    {
      title: node.title,
      uid: node.uid,
      name: node.name,
      [if std.objectHas(node, 'active') then 'active']: node.active,
    },
  getSiblingNodes(node, includeNode=true)::
    std.filter(
      function(x)
        x.parents == node.parents &&
        x.uid != node.uid,
      self.nodes
    ) + if includeNode then [node] else [],
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
  getChildrenNodes(node)::
    std.map(
      function (child)
        self.pluckParents(child),
      std.filter(
        function(x)
          std.member(
            x.parents,
            node.uid
          ),
          self.nodes
        )
    ),
  getPathToRoot(node, includeSiblings=false, markPath=true)::
    std.map(
      function (node_list)
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
                  target_node +
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
  getNavigation(node)::
    local pathToRoot = self.getPathToRoot(node, includeSiblings=true, markPath=true);
    local children = self.getChildrenNodes(node);
    if std.length(children) == 0 then
      pathToRoot
    else
      pathToRoot + [children],
}
