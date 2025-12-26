// Web Worker for offloading heavy data transformations

self.onmessage = (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  try {
    if (type === 'SHRED') {
      const result = shredSpaceData(payload);
      self.postMessage({ type: 'SUCCESS', id, payload: result });
    } else if (type === 'STITCH') {
      const result = stitchSpaceData(payload);
      self.postMessage({ type: 'SUCCESS', id, payload: result });
    } else {
      throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', id, error: error.message });
  }
};

function shredSpaceData(spaceData: any[]) {
  const spaces: any[] = [];
  const flows: any[] = [];
  const spaceMembers: any[] = [];
  const flowMembers: any[] = [];

  for (const space of spaceData) {
    const { flows: spaceFlows, spaceMembers: members, ...spaceProps } = space;
    spaces.push(spaceProps);

    // Extract Space Members
    if (members && Array.isArray(members)) {
      for (const member of members) {
        spaceMembers.push({ ...member, space_id: space.id });
      }
    }

    // Extract Flows and Flow Members
    if (spaceFlows && Array.isArray(spaceFlows)) {
      for (const flow of spaceFlows) {
        const { flow_member: fMembers, ...flowProps } = flow;
        flows.push({ ...flowProps, space_id: space.id });

        if (fMembers && Array.isArray(fMembers)) {
          for (const fMember of fMembers) {
            flowMembers.push({ ...fMember, flow_id: flow.id });
          }
        }
      }
    }
  }

  return { spaces, flows, spaceMembers, flowMembers };
}

function stitchSpaceData({ spaces, flows, spaceMembers, flowMembers }: any) {
  // 1. Index children for faster lookup (Group by parent ID)
  
  // Map<spaceId, SpaceMember[]>
  const spaceMemberMap = new Map<number, any[]>();
  // Use a simple loop for performance
  for (const m of spaceMembers) {
    let list = spaceMemberMap.get(m.space_id);
    if (!list) {
      list = [];
      spaceMemberMap.set(m.space_id, list);
    }
    list.push(m);
  }

  // Map<flowId, FlowMember[]>
  const flowMemberMap = new Map<number, any[]>();
  for (const fm of flowMembers) {
    let list = flowMemberMap.get(fm.flow_id);
    if (!list) {
      list = [];
      flowMemberMap.set(fm.flow_id, list);
    }
    list.push(fm);
  }

  // Map<spaceId, Flow[]>
  const flowMap = new Map<number, any[]>();
  for (const f of flows) {
    // Attach flow members to flow first
    const members = flowMemberMap.get(f.id) || [];
    const enrichedFlow = { ...f, flow_member: members };

    let list = flowMap.get(f.space_id);
    if (!list) {
      list = [];
      flowMap.set(f.space_id, list);
    }
    list.push(enrichedFlow);
  }

  // 2. Reconstruct the tree
  return spaces.map((space: any) => ({
    ...space,
    spaceMembers: spaceMemberMap.get(space.id) || [],
    flows: flowMap.get(space.id) || []
  }));
}
