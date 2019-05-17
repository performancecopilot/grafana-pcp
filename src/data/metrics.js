module.exports = [                                                                                                         
  {
    "name": "jbd2.njournals",
    "text-oneline": "Count of active JBD2 (Journal Block Device v2) devices",
    "text-help": "Count of active JBD2 (Journal Block Device v2) devices",
    "pmid": 511705088,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.count",
    "text-oneline": "Total transactions committed per journal",
    "text-help": "This metric is sourced from the per-device /proc/fs/jbd2 info file.",
    "pmid": 511705089,
    "indom": 511705088,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.requested",
    "text-oneline": "Total journal transactions requested per journal",
    "text-help": "This metric is sourced from the per-device /proc/fs/jbd2 info file.",
    "pmid": 511705090,
    "indom": 511705088,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.max_blocks",
    "text-oneline": "Maximum transaction blocks (buffers) per journal",
    "text-help": "This metric is sourced from the per-device /proc/fs/jbd2 info file.",
    "pmid": 511705091,
    "indom": 511705088,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.total.blocks",
    "text-oneline": "Total transaction blocks per journal",
    "text-help": "Total number of blocks in all transactions since device mounted.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705098,
    "indom": 511705088,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.blocks_logged",
    "text-oneline": "Total logged blocks per journal",
    "text-help": "Total number of blocks logged in all transactions since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705099,
    "indom": 511705088,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.handles",
    "text-oneline": "Total handle count per journal",
    "text-help": "Total count of handles used in all transactions since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705100,
    "indom": 511705088,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.waiting",
    "text-oneline": "Total time waiting per journal",
    "text-help": "Total time spent waiting for transactions to complete since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705092,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.request_delay",
    "text-oneline": "Total request delay per journal",
    "text-help": "Total request delay for all transactions to complete since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705093,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.running",
    "text-oneline": "Total running time per journal",
    "text-help": "Total transaction running time over all transactions since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705094,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.being_locked",
    "text-oneline": "Total locked time per journal",
    "text-help": "Total transaction locked time over all transactions since mount.\nDerived from values in the per-device /proc/fs/jbd2 info files.",
    "pmid": 511705095,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.flushing_ordered_mode_data",
    "text-oneline": "Total data flush time per journal",
    "text-help": "Total time flushing data (ordered mode) for all transactions since\nmount.  Derived from values in per-device /proc/fs/jbd2 info files.",
    "pmid": 511705096,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.total.time.logging",
    "text-oneline": "Total logging time per journal",
    "text-help": "Total time spent logging transactions for all transactions since\nmount.  Derived from values in per-device /proc/fs/jbd2 info files.",
    "pmid": 511705097,
    "indom": 511705088,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.average.blocks",
    "text-oneline": "Average transaction blocks per journal",
    "text-help": "Average number of blocks per transaction for all transactions.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705108,
    "indom": 511705088,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.average.blocks_logged",
    "text-oneline": "Average logged blocks per journal",
    "text-help": "Average number of blocks logged per transaction for all transactions.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705109,
    "indom": 511705088,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.average.handles",
    "text-oneline": "Average handle count per journal",
    "text-help": "Average number of handles used per transaction for all transactions.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705110,
    "indom": 511705088,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "jbd2.transaction.average.time.waiting",
    "text-oneline": "Average time waiting per journal",
    "text-help": "Average time spent waiting for transactions to complete since mount.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705101,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.request_delay",
    "text-oneline": "Average request delay per journal",
    "text-help": "Average request delay for all transactions to complete since mount.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705102,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.running",
    "text-oneline": "Average running time per journal",
    "text-help": "Average transaction running time over all transactions since mount.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705103,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.being_locked",
    "text-oneline": "Average locked time per journal",
    "text-help": "Average transaction locked time over all transactions since mount.\nExported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705104,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.flushing_ordered_mode_data",
    "text-oneline": "Average data flush time per journal",
    "text-help": "Average time flushing data (ordered mode) for all transactions since\nmount.  Exported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705105,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.logging",
    "text-oneline": "Average logging time per journal",
    "text-help": "Average time spent logging transactions for all transactions since\nmount.  Exported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705106,
    "indom": 511705088,
    "sem": "instant",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "jbd2.transaction.average.time.committing",
    "text-oneline": "Average commit time per journal",
    "text-help": "Average time spent committing transactions for all transactions since\nmount.  Exported directly from per-device /proc/fs/jbd2 info files.",
    "pmid": 511705107,
    "indom": 511705088,
    "sem": "instant",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kvm.trace.kvm_vcpu_wakeup",
    "pmid": 398459909,
    "indom": 398458880,
    "sem": "instant",
    "units": "",
    "type": "64"
  },
  {
    "name": "kvm.trace.kvm_hypercall",
    "pmid": 398459908,
    "indom": 398458880,
    "sem": "instant",
    "units": "",
    "type": "64"
  },
  {
    "name": "kvm.trace.kvm_mmio",
    "pmid": 398459907,
    "indom": 398458880,
    "sem": "instant",
    "units": "",
    "type": "64"
  },
  {
    "name": "kvm.trace.kvm_entry",
    "pmid": 398459906,
    "indom": 398458880,
    "sem": "instant",
    "units": "",
    "type": "64"
  },
  {
    "name": "kvm.trace.kvm_exit",
    "pmid": 398459905,
    "indom": 398458880,
    "sem": "instant",
    "units": "",
    "type": "64"
  },
  {
    "name": "kvm.trace.count",
    "pmid": 398459904,
    "sem": "discrete",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.efer_reload",
    "text-oneline": "Number of Extended Feature Enable Register (EFER) reloads.",
    "text-help": "Number of Extended Feature Enable Register (EFER) reloads.",
    "pmid": 398458880,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.exits",
    "text-oneline": "Number of guest exits from I/O port accesses. ",
    "text-help": "Number of guest exits from I/O port accesses. ",
    "pmid": 398458881,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.fpu_reload",
    "text-oneline": "Number of reload fpu(Float Point Unit).",
    "text-help": "Number of reload fpu(Float Point Unit).",
    "pmid": 398458882,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.halt_attempted_poll",
    "text-oneline": "Number of times the vcpu attempts to polls.",
    "text-help": "Number of times the vcpu attempts to polls.",
    "pmid": 398458883,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.halt_exits",
    "text-oneline": "Number of guest exits due to halt calls.",
    "text-help": "This type of exit is usually seen when a guest is idle.",
    "pmid": 398458884,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.halt_successful_poll",
    "text-oneline": "The number of times the vcpu attempts to polls successfully.",
    "text-help": "The number of times the vcpu attempts to polls successfully.",
    "pmid": 398458885,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.halt_wakeup",
    "text-oneline": "Number of wakeups from a halt.",
    "text-help": "Number of wakeups from a halt.",
    "pmid": 398458886,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.host_state_reload",
    "text-oneline": "Number of full reloads of the host state",
    "text-help": "Currently tallies MSR setup and guest MSR reads.",
    "pmid": 398458887,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.hypercalls",
    "text-oneline": "Number of guest hypervisor service calls.",
    "text-help": "Number of guest hypervisor service calls.",
    "pmid": 398458888,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.insn_emulation",
    "text-oneline": "Number of insn_emulation attempts.",
    "text-help": "Number of insn_emulation attempts.",
    "pmid": 398458889,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.insn_emulation_fail",
    "text-oneline": "Number of failed insn_emulation attempts.",
    "text-help": "Number of failed insn_emulation attempts.",
    "pmid": 398458890,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.invlpg",
    "text-oneline": "Number of invlpg attepts. ",
    "text-help": "Number of invlpg attepts. ",
    "pmid": 398458891,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.io_exits",
    "text-oneline": "Number of guest exits from I/O port accesses.",
    "text-help": "Number of guest exits from I/O port accesses.",
    "pmid": 398458892,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.irq_exits",
    "text-oneline": "Number of guest exits due to external interrupts.",
    "text-help": "Number of guest exits due to external interrupts.",
    "pmid": 398458893,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.irq_injections",
    "text-oneline": "Number of interrupts sent to guests.",
    "text-help": "Number of interrupts sent to guests.",
    "pmid": 398458894,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.irq_window",
    "text-oneline": "Number of guest exits from an outstanding interrupt window.",
    "text-help": "Number of guest exits from an outstanding interrupt window.",
    "pmid": 398458895,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.largepages",
    "text-oneline": "Number of large pages currently in use.",
    "text-help": "Number of large pages currently in use.",
    "pmid": 398458896,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmio_exits",
    "text-oneline": "Number of guest exits due to memory mapped I/O (MMIO) accesses.",
    "text-help": "Number of guest exits due to memory mapped I/O (MMIO) accesses.",
    "pmid": 398458897,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_cache_miss",
    "text-oneline": "Number of cache miss.",
    "text-help": "Number of cache miss.",
    "pmid": 398458898,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_flooded",
    "text-oneline": "Detection count of excessive write operations to an MMU page.",
    "text-help": "This counts detected write operations not of individual write operations.",
    "pmid": 398458899,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_pde_zapped",
    "text-oneline": "Number of page directory entry (PDE) destruction operations.",
    "text-help": "Number of page directory entry (PDE) destruction operations.",
    "pmid": 398458900,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_pte_updated",
    "text-oneline": "Number of PTE updated. ",
    "text-help": "Number of PTE updated. ",
    "pmid": 398458901,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_pte_write",
    "text-oneline": "Number of PTE write.",
    "text-help": "Number of PTE write.",
    "pmid": 398458902,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_recycled",
    "text-oneline": "Number of shadow pages that can be reclaimed.",
    "text-help": "Number of shadow pages that can be reclaimed.",
    "pmid": 398458903,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_shadow_zapped",
    "text-oneline": "Number of shadow pages that has been zapped.",
    "text-help": "Number of shadow pages that has been zapped.",
    "pmid": 398458904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.mmu_unsync",
    "text-oneline": "Number of non-synchronized pages which are not yet unlinked ",
    "text-help": "Number of non-synchronized pages which are not yet unlinked ",
    "pmid": 398458905,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.nmi_injections",
    "text-oneline": "Number of Non-maskable Interrupt (NMI) injections.",
    "text-help": "Number of Non-maskable Interrupt (NMI) injections.",
    "pmid": 398458906,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.nmi_window",
    "text-oneline": "Number of guest exits from (outstanding) Non-maskable Interrupt (NMI) windows.",
    "text-help": "Number of guest exits from (outstanding) Non-maskable Interrupt (NMI) windows.",
    "pmid": 398458907,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.pf_fixed",
    "text-oneline": "Number of fixed (non-paging) page table entry (PTE) maps.",
    "text-help": "Number of fixed (non-paging) page table entry (PTE) maps.",
    "pmid": 398458908,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.pf_guest",
    "text-oneline": "Number of page faults injected into guests.",
    "text-help": "Number of page faults injected into guests.",
    "pmid": 398458909,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.remote_tlb_flush",
    "text-oneline": "Number of tlb_flush operations performed by the hypervisor.",
    "text-help": "Number of tlb_flush operations performed by the hypervisor.",
    "pmid": 398458910,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.request_irq",
    "text-oneline": "Number of guest interrupt window request exits.",
    "text-help": "Number of guest interrupt window request exits.",
    "pmid": 398458911,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.signal_exits",
    "text-oneline": "Number of guest exits due to pending signals from the host.",
    "text-help": "Number of guest exits due to pending signals from the host.",
    "pmid": 398458912,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kvm.tlb_flush",
    "text-oneline": "Number of tlb_flush operations performed by the hypervisor.",
    "text-help": "Number of tlb_flush operations performed by the hypervisor.",
    "pmid": 398458913,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "hinv.physmem",
    "text-oneline": "total system memory metric from /proc/meminfo",
    "text-help": "total system memory metric from /proc/meminfo",
    "pmid": 251659273,
    "sem": "discrete",
    "units": "Mbyte",
    "type": "U32"
  },
  {
    "name": "hinv.pagesize",
    "text-oneline": "Memory page size",
    "text-help": "The memory page size of the running kernel in bytes.",
    "pmid": 251659275,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "hinv.ncpu",
    "text-oneline": "number of CPUs in the system",
    "text-help": "number of CPUs in the system",
    "pmid": 251658272,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.ndisk",
    "text-oneline": "number of disks in the system",
    "text-help": "number of disks in the system",
    "pmid": 251658273,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.nfilesys",
    "text-oneline": "number of (local) file systems currently mounted",
    "text-help": "number of (local) file systems currently mounted",
    "pmid": 251663360,
    "sem": "discrete",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hinv.ninterface",
    "text-oneline": "number of active (up) network interfaces",
    "text-help": "number of active (up) network interfaces",
    "pmid": 251661339,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.nnode",
    "text-oneline": "number of NUMA nodes in the system",
    "text-help": "number of NUMA nodes in the system",
    "pmid": 251658259,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.machine",
    "text-oneline": "hardware identifier as reported by uname(2)",
    "text-help": "hardware identifier as reported by uname(2)",
    "pmid": 251676679,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.hugepagesize",
    "text-oneline": "Huge page size from /proc/meminfo",
    "text-help": "The memory huge page size of the running kernel in bytes.",
    "pmid": 251659323,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "hinv.ntape",
    "text-oneline": "number of Linux scsi tape devices",
    "text-help": "number of Linux scsi tape devices",
    "pmid": 251730960,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.map.scsi",
    "text-oneline": "list of active SCSI devices",
    "text-help": "There is one string value for each SCSI device active in the system,\nas extracted from /proc/scsi/scsi. The external instance name\nfor each device is in the format scsiD:C:I:L where\nD is controller number, C is channel number, I is device ID\nand L is the SCSI LUN number for the device. The values for this\nmetric are the actual device names (sd[a-z] are SCSI disks, st[0-9]\nare SCSI tapes and scd[0-9] are SCSI CD-ROMS.",
    "pmid": 251673600,
    "indom": 251658251,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.map.cpu_num",
    "text-oneline": "logical to physical CPU mapping for each CPU",
    "text-help": "logical to physical CPU mapping for each CPU",
    "pmid": 251676678,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.map.cpu_node",
    "text-oneline": "logical CPU to NUMA node mapping for each CPU",
    "text-help": "logical CPU to NUMA node mapping for each CPU",
    "pmid": 251676680,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.map.dmname",
    "text-oneline": "per-device-mapper device persistent name mapping to dm-[0-9]*",
    "text-help": "per-device-mapper device persistent name mapping to dm-[0-9]*",
    "pmid": 251713549,
    "indom": 251658264,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.map.mdname",
    "text-oneline": "per-multi-device device persistent name mapping to md[0-9]*",
    "text-help": "per-multi-device device persistent name mapping to md[0-9]*",
    "pmid": 251718669,
    "indom": 251658265,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.clock",
    "text-oneline": "clock rate in Mhz for each CPU as reported by /proc/cpuinfo",
    "text-help": "clock rate in Mhz for each CPU as reported by /proc/cpuinfo",
    "pmid": 251676672,
    "indom": 251658240,
    "sem": "discrete",
    "units": "/ microsec",
    "type": "FLOAT"
  },
  {
    "name": "hinv.cpu.vendor",
    "text-oneline": "manufacturer of each CPU as reported by /proc/cpuinfo",
    "text-help": "manufacturer of each CPU as reported by /proc/cpuinfo",
    "pmid": 251676673,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.model",
    "text-oneline": "model number of each CPU as reported by /proc/cpuinfo",
    "text-help": "model number of each CPU as reported by /proc/cpuinfo",
    "pmid": 251676674,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.stepping",
    "text-oneline": "stepping of each CPU as reported by /proc/cpuinfo",
    "text-help": "stepping of each CPU as reported by /proc/cpuinfo",
    "pmid": 251676675,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.cache",
    "text-oneline": "primary cache size of each CPU as reported by /proc/cpuinfo",
    "text-help": "primary cache size of each CPU as reported by /proc/cpuinfo",
    "pmid": 251676676,
    "indom": 251658240,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hinv.cpu.bogomips",
    "text-oneline": "bogo mips rating for each CPU as reported by /proc/cpuinfo",
    "text-help": "bogo mips rating for each CPU as reported by /proc/cpuinfo",
    "pmid": 251676677,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hinv.cpu.model_name",
    "text-oneline": "model name of each CPU as reported by /proc/cpuinfo",
    "text-help": "model name of each CPU as reported by /proc/cpuinfo",
    "pmid": 251676681,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.flags",
    "text-oneline": "Hardware capability flags for each CPU as reported by /proc/cpuinfo",
    "text-help": "Hardware capability flags for each CPU as reported by /proc/cpuinfo",
    "pmid": 251676682,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hinv.cpu.cache_alignment",
    "text-oneline": "Cache alignment for each CPU as reported by /proc/cpuinfo",
    "text-help": "Cache alignment for each CPU as reported by /proc/cpuinfo",
    "pmid": 251676683,
    "indom": 251658240,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.cpu.online",
    "text-oneline": "CPU online state from /sys/devices/system/cpu/*/online",
    "text-help": "CPU online state from /sys/devices/system/cpu/*/online",
    "pmid": 251714560,
    "indom": 251658240,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hinv.node.online",
    "text-oneline": "NUMA node online state from /sys/devices/system/node/*/online",
    "text-help": "NUMA node online state from /sys/devices/system/node/*/online",
    "pmid": 251714561,
    "indom": 251658259,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.load",
    "text-oneline": "1, 5 and 15 minute load average",
    "text-help": "1, 5 and 15 minute load average",
    "pmid": 251660288,
    "indom": 251658242,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.intr",
    "text-oneline": "interrupt count metric from /proc/stat",
    "text-help": "The value is the first value from the intr field in /proc/stat,\nwhich is a counter of the total number of interrupts processed.\nThe value is normally converted to a rate (count/second).\nThis counter usually increases by at least HZ/second,\ni.e. the clock interrupt rate, wehich is usually 100/second.\n\nSee also kernel.percpu.intr and kernel.percpu.interrupts to get\nthe breakdown of interrupt count by interrupt type and which CPU\nprocessed each one.",
    "pmid": 251658252,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.all.pswitch",
    "text-oneline": "context switches metric from /proc/stat",
    "text-help": "context switches metric from /proc/stat",
    "pmid": 251658253,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.all.sysfork",
    "text-oneline": "fork rate metric from /proc/stat",
    "text-help": "fork rate metric from /proc/stat",
    "pmid": 251658254,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.all.running",
    "text-oneline": "number of currently running processes from /proc/stat",
    "text-help": "number of currently running processes from /proc/stat",
    "pmid": 251658255,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "kernel.all.blocked",
    "text-oneline": "number of currently blocked processes from /proc/stat",
    "text-help": "number of currently blocked processes from /proc/stat",
    "pmid": 251658256,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "kernel.all.hz",
    "text-oneline": "value of HZ (jiffies/second) for the currently running kernel",
    "text-help": "value of HZ (jiffies/second) for the currently running kernel",
    "pmid": 251658288,
    "sem": "discrete",
    "units": "count / sec",
    "type": "U32"
  },
  {
    "name": "kernel.all.uptime",
    "text-oneline": "time the current kernel has been running",
    "text-help": "time the current kernel has been running",
    "pmid": 251684864,
    "sem": "instant",
    "units": "sec",
    "type": "U32"
  },
  {
    "name": "kernel.all.idletime",
    "text-oneline": "time the current kernel has been idle since boot",
    "text-help": "time the current kernel has been idle since boot",
    "pmid": 251684865,
    "sem": "instant",
    "units": "sec",
    "type": "U32"
  },
  {
    "name": "kernel.all.nusers",
    "text-oneline": "number of user sessions on the system (including root)",
    "text-help": "number of user sessions on the system (including root)",
    "pmid": 251683840,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.nroots",
    "text-oneline": "number of root user sessions on the system (only root)",
    "text-help": "number of root user sessions on the system (only root)",
    "pmid": 251683841,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.nsessions",
    "text-oneline": "number of utmp sessions (login records)",
    "text-help": "number of utmp sessions (login records)",
    "pmid": 251683842,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.lastpid",
    "text-oneline": "most recently allocated process identifier",
    "text-help": "most recently allocated process identifier",
    "pmid": 251660289,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.runnable",
    "text-oneline": "total number of processes in the (per-CPU) run queues",
    "text-help": "total number of processes in the (per-CPU) run queues",
    "pmid": 251660290,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.nprocs",
    "text-oneline": "total number of processes (lightweight)",
    "text-help": "total number of processes (lightweight)",
    "pmid": 251660291,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.pid_max",
    "text-oneline": "maximum process identifier from /proc/sys/kernel/pid_max",
    "text-help": "maximum process identifier from /proc/sys/kernel/pid_max",
    "pmid": 251731970,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.cpu.user",
    "text-oneline": "total user CPU time from /proc/stat for all CPUs, including guest CPU time",
    "text-help": "total user CPU time from /proc/stat for all CPUs, including guest CPU time",
    "pmid": 251658260,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.nice",
    "text-oneline": "total nice user CPU time from /proc/stat for all CPUs, including guest time",
    "text-help": "total nice user CPU time from /proc/stat for all CPUs, including guest time",
    "pmid": 251658261,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.sys",
    "text-oneline": "total sys CPU time from /proc/stat for all CPUs",
    "text-help": "total sys CPU time from /proc/stat for all CPUs",
    "pmid": 251658262,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.idle",
    "text-oneline": "total idle CPU time from /proc/stat for all CPUs",
    "text-help": "total idle CPU time from /proc/stat for all CPUs",
    "pmid": 251658263,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.intr",
    "text-oneline": "total interrupt CPU time from /proc/stat for all CPUs",
    "text-help": "Total time spent processing interrupts on all CPUs.\nThis value includes both soft and hard interrupt processing time.",
    "pmid": 251658274,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.steal",
    "text-oneline": "total virtualisation CPU steal time for all CPUs",
    "text-help": "Total CPU time when a CPU had a runnable process, but the hypervisor\n(virtualisation layer) chose to run something else instead.",
    "pmid": 251658295,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.guest",
    "text-oneline": "total virtual guest CPU time for all CPUs",
    "text-help": "Total CPU time spent running virtual guest operating systems.",
    "pmid": 251658300,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.vuser",
    "text-oneline": "total user CPU time from /proc/stat for all CPUs, excluding guest CPU time",
    "text-help": "total user CPU time from /proc/stat for all CPUs, excluding guest CPU time",
    "pmid": 251658318,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.guest_nice",
    "text-oneline": "total virtual guest CPU nice time for all CPUs",
    "text-help": "Total CPU nice time spent running virtual guest operating systems.",
    "pmid": 251658321,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.vnice",
    "text-oneline": "total nice user CPU time from /proc/stat for all CPUs, excluding guest time",
    "text-help": "total nice user CPU time from /proc/stat for all CPUs, excluding guest time",
    "pmid": 251658322,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.wait.total",
    "text-oneline": "total wait CPU time from /proc/stat for all CPUs",
    "text-help": "total wait CPU time from /proc/stat for all CPUs",
    "pmid": 251658275,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.irq.soft",
    "text-oneline": "soft interrupt CPU time from /proc/stat for all CPUs",
    "text-help": "Total soft interrupt CPU time (deferred interrupt handling code,\nnot run in the initial interrupt handler).",
    "pmid": 251658293,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.cpu.irq.hard",
    "text-oneline": "hard interrupt CPU time from /proc/stat for all CPUs",
    "text-help": "Total hard interrupt CPU time (\"hard\" interrupt handling code\nis the code run directly on receipt of the initial hardware\ninterrupt, and does not include \"soft\" interrupt handling code\nwhich is deferred until later).",
    "pmid": 251658294,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.all.interrupts.total",
    "pmid": 251662336,
    "indom": 251658244,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.all.interrupts.errors",
    "text-oneline": "interrupt error count from /proc/interrupts",
    "text-help": "This is a global counter (normally converted to a count/second)\nfor any and all errors that occur while handling interrupts.",
    "pmid": 251662339,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.all.softirqs.total",
    "pmid": 251742208,
    "indom": 251658276,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.all.entropy.avail",
    "text-oneline": "entropy available to random number generators",
    "text-help": "entropy available to random number generators",
    "pmid": 251731968,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.entropy.poolsize",
    "text-oneline": "maximum size of the entropy pool",
    "text-help": "maximum size of the entropy pool",
    "pmid": 251731969,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "kernel.all.pressure.cpu.some.avg",
    "text-oneline": "Percentage of time runnable processes delayed for CPU resources",
    "text-help": "Indicates the time in which at least some tasks stalled on CPU resources.\nThe ratios are tracked as recent trends over ten second, one minute,\nand five minute windows.\nPressure stall information (PSI) from /proc/pressure/cpu.",
    "pmid": 251743232,
    "indom": 251658277,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.pressure.cpu.some.total",
    "text-oneline": "Total time processes stalled for CPU resources",
    "text-help": "Indicates the time in which at least some tasks stalled on CPU resources.\nPressure stall information (PSI) from /proc/pressure/cpu.",
    "pmid": 251743233,
    "sem": "counter",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kernel.all.pressure.memory.some.avg",
    "text-oneline": "Percentage of time runnable processes delayed for memory resources",
    "text-help": "Indicates the time in which at least some tasks stalled on memory resources.\nThe ratios are tracked as recent trends over ten second, one minute,\nand five minute windows.\nPressure stall information (PSI) from /proc/pressure/memory.",
    "pmid": 251744256,
    "indom": 251658277,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.pressure.memory.some.total",
    "text-oneline": "Total time processes stalled for memory resources",
    "text-help": "The CPU time for which at least some tasks stalled on memory resources.\nPressure stall information (PSI) from /proc/pressure/memory.",
    "pmid": 251744257,
    "sem": "counter",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kernel.all.pressure.memory.full.avg",
    "text-oneline": "Percentage of time all work is delayed from memory pressure",
    "text-help": "Indicates the time in which all tasks stalled on memory resources.\nThe ratios are tracked as recent trends over ten second, one minute,\nand five minute windows.\nPressure stall information (PSI) from /proc/pressure/memory.",
    "pmid": 251744258,
    "indom": 251658277,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.pressure.memory.full.total",
    "text-oneline": "Total time when all tasks stall on memory resources",
    "text-help": "The CPU time for which all tasks stalled on memory resources.\nPressure stall information (PSI) from /proc/pressure/memory.",
    "pmid": 251744259,
    "sem": "counter",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kernel.all.pressure.io.some.avg",
    "text-oneline": "Percentage of time runnable processes delayed for IO resources",
    "text-help": "Indicates the time in which at least some tasks stalled on IO resources.\nThe ratios are tracked as recent trends over ten second, one minute,\nand five minute windows.\nPressure stall information (PSI) from /proc/pressure/io.",
    "pmid": 251745280,
    "indom": 251658277,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.pressure.io.some.total",
    "text-oneline": "Total time processes stalled for IO resources",
    "text-help": "The CPU time in which at least some tasks stalled on IO resources.\nPressure stall information (PSI) from /proc/pressure/io.",
    "pmid": 251745281,
    "sem": "counter",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kernel.all.pressure.io.full.avg",
    "text-oneline": "Percentage of time all work is delayed from IO pressure",
    "text-help": "Indicates the time in which all tasks stalled on IO resources.\nThe ratios are tracked as recent trends over ten second, one minute,\nand five minute windows.\nPressure stall information (PSI) from /proc/pressure/io.",
    "pmid": 251745282,
    "indom": 251658277,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "kernel.all.pressure.io.full.total",
    "text-oneline": "Total time when all tasks stall on IO resources",
    "text-help": "The CPU time in which all tasks stalled on IO resources.\nPressure stall information (PSI) from /proc/pressure/io.",
    "pmid": 251745283,
    "sem": "counter",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.interrupts.PIW",
    "text-oneline": "Posted-interrupt wakeup event",
    "text-help": "Posted-interrupt wakeup event",
    "pmid": 251709461,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.NPI",
    "text-oneline": "Nested posted-interrupt event",
    "text-help": "Nested posted-interrupt event",
    "pmid": 251709460,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.PIN",
    "text-oneline": "Posted-interrupt notification event",
    "text-help": "Posted-interrupt notification event",
    "pmid": 251709459,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.MIS",
    "pmid": 251709458,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.ERR",
    "pmid": 251709457,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.HVS",
    "text-oneline": "Hyper-V stimer0 interrupts",
    "text-help": "Hyper-V stimer0 interrupts",
    "pmid": 251709456,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.HRE",
    "text-oneline": "Hyper-V reenlightenment interrupts",
    "text-help": "Hyper-V reenlightenment interrupts",
    "pmid": 251709455,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.HYP",
    "text-oneline": "Hypervisor callback interrupts",
    "text-help": "Hypervisor callback interrupts",
    "pmid": 251709454,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.MCP",
    "text-oneline": "Machine check polls",
    "text-help": "Machine check polls",
    "pmid": 251709453,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.MCE",
    "text-oneline": "Machine check exceptions",
    "text-help": "Machine check exceptions",
    "pmid": 251709452,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.DFR",
    "text-oneline": "Deferred Error APIC interrupts",
    "text-help": "Deferred Error APIC interrupts",
    "pmid": 251709451,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.THR",
    "text-oneline": "Threshold APIC interrupts",
    "text-help": "Threshold APIC interrupts",
    "pmid": 251709450,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.TRM",
    "text-oneline": "Thermal event interrupts",
    "text-help": "Thermal event interrupts",
    "pmid": 251709449,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.TLB",
    "text-oneline": "TLB shootdowns",
    "text-help": "TLB shootdowns",
    "pmid": 251709448,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.CAL",
    "text-oneline": "Function call interrupts",
    "text-help": "Function call interrupts",
    "pmid": 251709447,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.RES",
    "text-oneline": "Rescheduling interrupts",
    "text-help": "Rescheduling interrupts",
    "pmid": 251709446,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.RTR",
    "text-oneline": "APIC ICR read retries",
    "text-help": "APIC ICR read retries",
    "pmid": 251709445,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.IWI",
    "text-oneline": "IRQ work interrupts",
    "text-help": "IRQ work interrupts",
    "pmid": 251709444,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.PMI",
    "text-oneline": "Performance monitoring interrupts",
    "text-help": "Performance monitoring interrupts",
    "pmid": 251709443,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.SPU",
    "text-oneline": "Spurious interrupts",
    "text-help": "Spurious interrupts",
    "pmid": 251709442,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.LOC",
    "text-oneline": "Local timer interrupts",
    "text-help": "Local timer interrupts",
    "pmid": 251709441,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.NMI",
    "text-oneline": "Non-maskable interrupts",
    "text-help": "Non-maskable interrupts",
    "pmid": 251709440,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line69",
    "text-oneline": "PCI-MSI 81928-edge eth0-Tx-Rx-7",
    "text-help": "PCI-MSI 81928-edge eth0-Tx-Rx-7",
    "pmid": 251708466,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line68",
    "text-oneline": "PCI-MSI 81927-edge eth0-Tx-Rx-6",
    "text-help": "PCI-MSI 81927-edge eth0-Tx-Rx-6",
    "pmid": 251708465,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line67",
    "text-oneline": "PCI-MSI 81926-edge eth0-Tx-Rx-5",
    "text-help": "PCI-MSI 81926-edge eth0-Tx-Rx-5",
    "pmid": 251708464,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line66",
    "text-oneline": "PCI-MSI 81925-edge eth0-Tx-Rx-4",
    "text-help": "PCI-MSI 81925-edge eth0-Tx-Rx-4",
    "pmid": 251708463,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line65",
    "text-oneline": "PCI-MSI 81924-edge eth0-Tx-Rx-3",
    "text-help": "PCI-MSI 81924-edge eth0-Tx-Rx-3",
    "pmid": 251708462,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line64",
    "text-oneline": "PCI-MSI 81923-edge eth0-Tx-Rx-2",
    "text-help": "PCI-MSI 81923-edge eth0-Tx-Rx-2",
    "pmid": 251708461,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line63",
    "text-oneline": "PCI-MSI 81922-edge eth0-Tx-Rx-1",
    "text-help": "PCI-MSI 81922-edge eth0-Tx-Rx-1",
    "pmid": 251708460,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line62",
    "text-oneline": "PCI-MSI 81921-edge eth0-Tx-Rx-0",
    "text-help": "PCI-MSI 81921-edge eth0-Tx-Rx-0",
    "pmid": 251708459,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line61",
    "text-oneline": "PCI-MSI 81920-edge ena-mgmnt@pci:0000:00:05.0",
    "text-help": "PCI-MSI 81920-edge ena-mgmnt@pci:0000:00:05.0",
    "pmid": 251708458,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line60",
    "text-oneline": "PCI-MSI 65538-edge nvme0q2",
    "text-help": "PCI-MSI 65538-edge nvme0q2",
    "pmid": 251708457,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line59",
    "text-oneline": "PCI-MSI 65537-edge nvme0q1",
    "text-help": "PCI-MSI 65537-edge nvme0q1",
    "pmid": 251708456,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line58",
    "text-oneline": "PCI-MSI 507920-edge nvme2q16",
    "text-help": "PCI-MSI 507920-edge nvme2q16",
    "pmid": 251708455,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line57",
    "text-oneline": "PCI-MSI 507919-edge nvme2q15",
    "text-help": "PCI-MSI 507919-edge nvme2q15",
    "pmid": 251708454,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line56",
    "text-oneline": "PCI-MSI 507918-edge nvme2q14",
    "text-help": "PCI-MSI 507918-edge nvme2q14",
    "pmid": 251708453,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line55",
    "text-oneline": "PCI-MSI 507917-edge nvme2q13",
    "text-help": "PCI-MSI 507917-edge nvme2q13",
    "pmid": 251708452,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line54",
    "text-oneline": "PCI-MSI 507916-edge nvme2q12",
    "text-help": "PCI-MSI 507916-edge nvme2q12",
    "pmid": 251708451,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line53",
    "text-oneline": "PCI-MSI 507915-edge nvme2q11",
    "text-help": "PCI-MSI 507915-edge nvme2q11",
    "pmid": 251708450,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line52",
    "text-oneline": "PCI-MSI 507914-edge nvme2q10",
    "text-help": "PCI-MSI 507914-edge nvme2q10",
    "pmid": 251708449,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line51",
    "text-oneline": "PCI-MSI 507913-edge nvme2q9",
    "text-help": "PCI-MSI 507913-edge nvme2q9",
    "pmid": 251708448,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line50",
    "text-oneline": "PCI-MSI 507912-edge nvme2q8",
    "text-help": "PCI-MSI 507912-edge nvme2q8",
    "pmid": 251708447,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line49",
    "text-oneline": "PCI-MSI 507911-edge nvme2q7",
    "text-help": "PCI-MSI 507911-edge nvme2q7",
    "pmid": 251708446,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line48",
    "text-oneline": "PCI-MSI 507910-edge nvme2q6",
    "text-help": "PCI-MSI 507910-edge nvme2q6",
    "pmid": 251708445,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line47",
    "text-oneline": "PCI-MSI 507909-edge nvme2q5",
    "text-help": "PCI-MSI 507909-edge nvme2q5",
    "pmid": 251708444,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line46",
    "text-oneline": "PCI-MSI 507908-edge nvme2q4",
    "text-help": "PCI-MSI 507908-edge nvme2q4",
    "pmid": 251708443,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line45",
    "text-oneline": "PCI-MSI 507907-edge nvme2q3",
    "text-help": "PCI-MSI 507907-edge nvme2q3",
    "pmid": 251708442,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line44",
    "text-oneline": "PCI-MSI 507906-edge nvme2q2",
    "text-help": "PCI-MSI 507906-edge nvme2q2",
    "pmid": 251708441,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line43",
    "text-oneline": "PCI-MSI 507905-edge nvme2q1",
    "text-help": "PCI-MSI 507905-edge nvme2q1",
    "pmid": 251708440,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line42",
    "text-oneline": "PCI-MSI 491536-edge nvme1q16",
    "text-help": "PCI-MSI 491536-edge nvme1q16",
    "pmid": 251708439,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line41",
    "text-oneline": "PCI-MSI 491535-edge nvme1q15",
    "text-help": "PCI-MSI 491535-edge nvme1q15",
    "pmid": 251708438,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line40",
    "text-oneline": "PCI-MSI 491534-edge nvme1q14",
    "text-help": "PCI-MSI 491534-edge nvme1q14",
    "pmid": 251708437,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line39",
    "text-oneline": "PCI-MSI 491533-edge nvme1q13",
    "text-help": "PCI-MSI 491533-edge nvme1q13",
    "pmid": 251708436,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line38",
    "text-oneline": "PCI-MSI 491532-edge nvme1q12",
    "text-help": "PCI-MSI 491532-edge nvme1q12",
    "pmid": 251708435,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line37",
    "text-oneline": "PCI-MSI 491531-edge nvme1q11",
    "text-help": "PCI-MSI 491531-edge nvme1q11",
    "pmid": 251708434,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line36",
    "text-oneline": "PCI-MSI 491530-edge nvme1q10",
    "text-help": "PCI-MSI 491530-edge nvme1q10",
    "pmid": 251708433,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line35",
    "text-oneline": "PCI-MSI 491529-edge nvme1q9",
    "text-help": "PCI-MSI 491529-edge nvme1q9",
    "pmid": 251708432,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line34",
    "text-oneline": "PCI-MSI 491528-edge nvme1q8",
    "text-help": "PCI-MSI 491528-edge nvme1q8",
    "pmid": 251708431,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line33",
    "text-oneline": "PCI-MSI 491527-edge nvme1q7",
    "text-help": "PCI-MSI 491527-edge nvme1q7",
    "pmid": 251708430,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line32",
    "text-oneline": "PCI-MSI 491526-edge nvme1q6",
    "text-help": "PCI-MSI 491526-edge nvme1q6",
    "pmid": 251708429,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line31",
    "text-oneline": "PCI-MSI 491525-edge nvme1q5",
    "text-help": "PCI-MSI 491525-edge nvme1q5",
    "pmid": 251708428,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line30",
    "text-oneline": "PCI-MSI 491524-edge nvme1q4",
    "text-help": "PCI-MSI 491524-edge nvme1q4",
    "pmid": 251708427,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line29",
    "text-oneline": "PCI-MSI 491523-edge nvme1q3",
    "text-help": "PCI-MSI 491523-edge nvme1q3",
    "pmid": 251708426,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line28",
    "text-oneline": "PCI-MSI 491522-edge nvme1q2",
    "text-help": "PCI-MSI 491522-edge nvme1q2",
    "pmid": 251708425,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line27",
    "text-oneline": "PCI-MSI 491521-edge nvme1q1",
    "text-help": "PCI-MSI 491521-edge nvme1q1",
    "pmid": 251708424,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line26",
    "text-oneline": "PCI-MSI 507904-edge nvme2q0",
    "text-help": "PCI-MSI 507904-edge nvme2q0",
    "pmid": 251708423,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line25",
    "text-oneline": "PCI-MSI 65536-edge nvme0q0",
    "text-help": "PCI-MSI 65536-edge nvme0q0",
    "pmid": 251708422,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line24",
    "text-oneline": "PCI-MSI 491520-edge nvme1q0",
    "text-help": "PCI-MSI 491520-edge nvme1q0",
    "pmid": 251708421,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line9",
    "text-oneline": "IO-APIC 9-fasteoi acpi",
    "text-help": "IO-APIC 9-fasteoi acpi",
    "pmid": 251708420,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line8",
    "text-oneline": "IO-APIC 8-edge rtc0",
    "text-help": "IO-APIC 8-edge rtc0",
    "pmid": 251708419,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line4",
    "text-oneline": "IO-APIC 4-edge ttyS0",
    "text-help": "IO-APIC 4-edge ttyS0",
    "pmid": 251708418,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line1",
    "text-oneline": "IO-APIC 1-edge i8042",
    "text-help": "IO-APIC 1-edge i8042",
    "pmid": 251708417,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.interrupts.line0",
    "text-oneline": "IO-APIC 0-edge timer",
    "text-help": "IO-APIC 0-edge timer",
    "pmid": 251708416,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.RCU",
    "pmid": 251722761,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.HRTIMER",
    "pmid": 251722760,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.SCHED",
    "pmid": 251722759,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.TASKLET",
    "pmid": 251722758,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.IRQ_POLL",
    "pmid": 251722757,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.BLOCK",
    "pmid": 251722756,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.NET_RX",
    "pmid": 251722755,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.NET_TX",
    "pmid": 251722754,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.TIMER",
    "pmid": 251722753,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.softirqs.HI",
    "pmid": 251722752,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "kernel.percpu.intr",
    "text-oneline": "interrupt count metric from /proc/interrupts",
    "text-help": "Aggregate count of each CPUs interrupt processing count, calculated\nas the sum of all interrupt types in /proc/interrupts for each CPU.",
    "pmid": 251662340,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.user",
    "text-oneline": "percpu user CPU time metric from /proc/stat, including guest CPU time",
    "text-help": "percpu user CPU time metric from /proc/stat, including guest CPU time",
    "pmid": 251658240,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.nice",
    "text-oneline": "percpu nice user CPU time metric from /proc/stat, including guest CPU time",
    "text-help": "percpu nice user CPU time metric from /proc/stat, including guest CPU time",
    "pmid": 251658241,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.sys",
    "text-oneline": "percpu sys CPU time metric from /proc/stat",
    "text-help": "percpu sys CPU time metric from /proc/stat",
    "pmid": 251658242,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.idle",
    "text-oneline": "percpu idle CPU time metric from /proc/stat",
    "text-help": "percpu idle CPU time metric from /proc/stat",
    "pmid": 251658243,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.intr",
    "text-oneline": "percpu interrupt CPU time ",
    "text-help": "Total time spent processing interrupts on each CPU (this includes\nboth soft and hard interrupt processing time).",
    "pmid": 251658271,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.steal",
    "text-oneline": "percpu CPU steal time ",
    "text-help": "Per-CPU time when the CPU had a runnable process, but the hypervisor\n(virtualisation layer) chose to run something else instead.",
    "pmid": 251658298,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.guest",
    "text-oneline": "percpu guest CPU time",
    "text-help": "Per-CPU time spent running (virtual) guest operating systems.",
    "pmid": 251658301,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.vuser",
    "text-oneline": "percpu user CPU time metric from /proc/stat, excluding guest CPU time",
    "text-help": "percpu user CPU time metric from /proc/stat, excluding guest CPU time",
    "pmid": 251658316,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.guest_nice",
    "text-oneline": "percpu nice guest CPU time",
    "text-help": "Per-CPU nice time spent running (virtual) guest operating systems.",
    "pmid": 251658323,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.vnice",
    "text-oneline": "percpu nice user CPU time metric from /proc/stat, excluding guest CPU time",
    "text-help": "percpu nice user CPU time metric from /proc/stat, excluding guest CPU time",
    "pmid": 251658324,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.wait.total",
    "text-oneline": "percpu wait CPU time",
    "text-help": "Per-CPU I/O wait CPU time - time spent with outstanding I/O requests.",
    "pmid": 251658270,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.irq.soft",
    "text-oneline": "percpu soft interrupt CPU time ",
    "text-help": "Per-CPU soft interrupt CPU time (deferred interrupt handling code,\nnot run in the initial interrupt handler).",
    "pmid": 251658296,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.percpu.cpu.irq.hard",
    "text-oneline": "percpu hard interrupt CPU time ",
    "text-help": "Per-CPU hard interrupt CPU time (\"hard\" interrupt handling code\nis the code run directly on receipt of the initial hardware\ninterrupt, and does not include \"soft\" interrupt handling code\nwhich is deferred until later).",
    "pmid": 251658297,
    "indom": 251658240,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.user",
    "text-oneline": "total user CPU time from /proc/stat for each node, including guest CPU time",
    "text-help": "total user CPU time from /proc/stat for each node, including guest CPU time",
    "pmid": 251658302,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.nice",
    "text-oneline": "total nice user CPU time from /proc/stat for each node, including guest time",
    "text-help": "total nice user CPU time from /proc/stat for each node, including guest time",
    "pmid": 251658303,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.sys",
    "text-oneline": "total sys CPU time from /proc/stat for each node",
    "text-help": "total sys CPU time from /proc/stat for each node",
    "pmid": 251658304,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.idle",
    "text-oneline": "total idle CPU time from /proc/stat for each node",
    "text-help": "total idle CPU time from /proc/stat for each node",
    "pmid": 251658305,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.intr",
    "text-oneline": "total interrupt CPU time from /proc/stat for each node",
    "text-help": "total interrupt CPU time from /proc/stat for each node",
    "pmid": 251658306,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.steal",
    "text-oneline": "total virtualisation CPU steal time for each node",
    "text-help": "total virtualisation CPU steal time for each node",
    "pmid": 251658307,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.guest",
    "text-oneline": "total virtual guest CPU time for each node",
    "text-help": "total virtual guest CPU time for each node",
    "pmid": 251658308,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.vuser",
    "text-oneline": "total user CPU time from /proc/stat for each node, excluding guest CPU time",
    "text-help": "total user CPU time from /proc/stat for each node, excluding guest CPU time",
    "pmid": 251658317,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.guest_nice",
    "text-oneline": "total virtual nice guest CPU time for each node",
    "text-help": "total virtual nice guest CPU time for each node",
    "pmid": 251658325,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.vnice",
    "text-oneline": "total nice user CPU time from /proc/stat for each node, excluding guest time",
    "text-help": "total nice user CPU time from /proc/stat for each node, excluding guest time",
    "pmid": 251658326,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.wait.total",
    "text-oneline": "total wait CPU time from /proc/stat for each node",
    "text-help": "total wait CPU time from /proc/stat for each node",
    "pmid": 251658309,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.irq.soft",
    "text-oneline": "soft interrupt CPU time from /proc/stat for each node",
    "text-help": "soft interrupt CPU time from /proc/stat for each node",
    "pmid": 251658310,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.pernode.cpu.irq.hard",
    "text-oneline": "hard interrupt CPU time from /proc/stat for each node",
    "text-help": "hard interrupt CPU time from /proc/stat for each node",
    "pmid": 251658311,
    "indom": 251658259,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "kernel.uname.release",
    "text-oneline": "release level of the running kernel",
    "text-help": "Release level of the running kernel as reported via the release[]\nvalue returned from uname(2) or uname -r.\n\nSee also pmda.uname.",
    "pmid": 251670528,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "kernel.uname.version",
    "text-oneline": "version level (build number) and build date of the running kernel",
    "text-help": "Version level of the running kernel as reported by the version[]\nvalue returned from uname(2) or uname -v.  Usually a build number\nfollowed by a build date.\n\nSee also pmda.uname.",
    "pmid": 251670529,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "kernel.uname.sysname",
    "text-oneline": "name of the implementation of the operating system",
    "text-help": "Name of the implementation of the running operating system as reported\nby the sysname[] value returned from uname(2) or uname -s.  Usually\n\"Linux\".\n\nSee also pmda.uname.",
    "pmid": 251670530,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "kernel.uname.machine",
    "text-oneline": "name of the hardware type the system is running on",
    "text-help": "Name of the hardware type the system is running on as reported by the machine[]\nvalue returned from uname(2) or uname -m, e.g. \"i686\".\n\nSee also pmda.uname.",
    "pmid": 251670531,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "kernel.uname.nodename",
    "text-oneline": "host name of this node on the network",
    "text-help": "Name of this node on the network as reported by the nodename[]\nvalue returned from uname(2) or uname -n.  Usually a synonym for\nthe host name.\n\nSee also pmda.uname.",
    "pmid": 251670532,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "kernel.uname.distro",
    "text-oneline": "Linux distribution name",
    "text-help": "The Linux distribution name, as determined by a number of heuristics.\nFor example:\n+ on Fedora, the contents of /etc/fedora-release\n+ on RedHat, the contents of /etc/redhat-release",
    "pmid": 251670535,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "mem.physmem",
    "text-oneline": "total system memory metric reported by /proc/meminfo",
    "text-help": "The value of this metric corresponds to the \"MemTotal\" field\nreported by /proc/meminfo. Note that this does not necessarily\ncorrespond to actual installed physical memory - there may\nbe areas of the physical address space mapped as ROM in\nvarious peripheral devices and the bios may be mirroring\ncertain ROMs in RAM.",
    "pmid": 251659264,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.freemem",
    "text-oneline": "free system memory metric from /proc/meminfo",
    "text-help": "free system memory metric from /proc/meminfo",
    "pmid": 251659274,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.used",
    "text-oneline": "used memory metric from /proc/meminfo",
    "text-help": "Used memory is the difference between mem.physmem and mem.freemem.",
    "pmid": 251659265,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.free",
    "text-oneline": "free memory metric from /proc/meminfo",
    "text-help": "Alias for mem.freemem.",
    "pmid": 251659266,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.shared",
    "text-oneline": "shared memory metric from /proc/meminfo",
    "text-help": "Shared memory metric. Currently always zero on Linux 2.4 kernels\nand has been removed from 2.6 kernels.",
    "pmid": 251659267,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.bufmem",
    "text-oneline": "I/O buffers metric from /proc/meminfo",
    "text-help": "Memory allocated for buffer_heads.",
    "pmid": 251659268,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.cached",
    "text-oneline": "page cache metric from /proc/meminfo",
    "text-help": "Memory used by the page cache, including buffered file data.\nThis is in-memory cache for files read from the disk (the pagecache)\nbut doesn't include SwapCached.",
    "pmid": 251659269,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.other",
    "text-oneline": "unaccounted memory",
    "text-help": "Memory that is not free (i.e. has been referenced) and is not cached.\nmem.physmem - mem.util.free - mem.util.cached - mem.util.buffers",
    "pmid": 251659276,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.swapCached",
    "text-oneline": "Kbytes in swap cache, from /proc/meminfo",
    "text-help": "Memory that once was swapped out, is swapped back in but still also\nis in the swapfile (if memory is needed it doesn't need to be swapped\nout AGAIN because it is already in the swapfile. This saves I/O)",
    "pmid": 251659277,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.active",
    "text-oneline": "Kbytes on the active page list (recently referenced pages)",
    "text-help": "Memory that has been used more recently and usually not reclaimed unless\nabsolutely necessary.",
    "pmid": 251659278,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.inactive",
    "text-oneline": "Kbytes on the inactive page list (candidates for discarding)",
    "text-help": "Memory which has been less recently used.  It is more eligible to be\nreclaimed for other purposes",
    "pmid": 251659279,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.highTotal",
    "text-oneline": "Kbytes in high memory, from /proc/meminfo",
    "text-help": "This is apparently an i386 specific metric, and seems to be always zero\non ia64 architecture (and possibly others). On i386 arch (at least),\nhighmem is all memory above ~860MB of physical memory. Highmem areas\nare for use by userspace programs, or for the pagecache. The kernel\nmust use tricks to access this memory, making it slower to access\nthan lowmem.",
    "pmid": 251659280,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.highFree",
    "text-oneline": "Kbytes free high memory, from /proc/meminfo",
    "text-help": "See mem.util.highTotal. Not used on ia64 arch (and possibly others).",
    "pmid": 251659281,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.lowTotal",
    "text-oneline": "Kbytes in low memory total, from /proc/meminfo",
    "text-help": "Lowmem is memory which can be used for everything that highmem can be\nused for, but it is also availble for the kernel's use for its own\ndata structures. Among many other things, it is where everything\nfrom the Slab is allocated.  Bad things happen when you're out of lowmem.\n(this may only be true on i386 architectures).",
    "pmid": 251659282,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.lowFree",
    "text-oneline": "Kbytes free low memory, from /proc/meminfo",
    "text-help": "See mem.util.lowTotal",
    "pmid": 251659283,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.swapTotal",
    "text-oneline": "Kbytes swap, from /proc/meminfo",
    "text-help": "total amount of swap space available",
    "pmid": 251659284,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.swapFree",
    "text-oneline": "Kbytes free swap, from /proc/meminfo",
    "text-help": "Memory which has been evicted from RAM, and is temporarily on the disk",
    "pmid": 251659285,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.dirty",
    "text-oneline": "Kbytes in dirty pages, from /proc/meminfo",
    "text-help": "Memory which is waiting to get written back to the disk",
    "pmid": 251659286,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.writeback",
    "text-oneline": "Kbytes in writeback pages, from /proc/meminfo",
    "text-help": "Memory which is actively being written back to the disk",
    "pmid": 251659287,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.mapped",
    "text-oneline": "Kbytes in mapped pages, from /proc/meminfo",
    "text-help": "files which have been mmaped, such as libraries",
    "pmid": 251659288,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.slab",
    "text-oneline": "Kbytes in slab memory, from /proc/meminfo",
    "text-help": "in-kernel data structures cache",
    "pmid": 251659289,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.committed_AS",
    "text-oneline": "Kbytes committed to address spaces, from /proc/meminfo",
    "text-help": "An estimate of how much RAM you would need to make a 99.99% guarantee\nthat there never is OOM (out of memory) for this workload. Normally\nthe kernel will overcommit memory. That means, say you do a 1GB malloc,\nnothing happens, really. Only when you start USING that malloc memory\nyou will get real memory on demand, and just as much as you use.",
    "pmid": 251659290,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.pageTables",
    "text-oneline": "Kbytes in kernel page tables, from /proc/meminfo",
    "text-help": "Kbytes in kernel page tables, from /proc/meminfo",
    "pmid": 251659291,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.reverseMaps",
    "text-oneline": "Kbytes in reverse mapped pages, from /proc/meminfo",
    "text-help": "Kbytes in reverse mapped pages, from /proc/meminfo",
    "pmid": 251659292,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.cache_clean",
    "text-oneline": "Kbytes cached and not dirty or writeback, derived from /proc/meminfo",
    "text-help": "Kbytes cached and not dirty or writeback, derived from /proc/meminfo",
    "pmid": 251659293,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.anonpages",
    "text-oneline": "Kbytes in user pages not backed by files, from /proc/meminfo",
    "text-help": "Kbytes in user pages not backed by files, from /proc/meminfo",
    "pmid": 251659294,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.commitLimit",
    "text-oneline": "Kbytes limit for address space commit, from /proc/meminfo",
    "text-help": "The static total, in Kbytes, available for commitment to address \nspaces. Thus, mem.util.committed_AS may range up to this total. Normally \nthe kernel overcommits memory, so this value may exceed mem.physmem",
    "pmid": 251659295,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.bounce",
    "text-oneline": "Kbytes in bounce buffers, from /proc/meminfo",
    "text-help": "Kbytes in bounce buffers, from /proc/meminfo",
    "pmid": 251659296,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.NFS_Unstable",
    "text-oneline": "Kbytes in NFS unstable memory, from /proc/meminfo",
    "text-help": "Kbytes in NFS unstable memory, from /proc/meminfo",
    "pmid": 251659297,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.slabReclaimable",
    "text-oneline": "Kbytes in reclaimable slab pages, from /proc/meminfo",
    "text-help": "Kbytes in reclaimable slab pages, from /proc/meminfo",
    "pmid": 251659298,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.slabUnreclaimable",
    "text-oneline": "Kbytes in unreclaimable slab pages, from /proc/meminfo",
    "text-help": "Kbytes in unreclaimable slab pages, from /proc/meminfo",
    "pmid": 251659299,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.active_anon",
    "text-oneline": "anonymous Active list LRU memory",
    "text-help": "anonymous Active list LRU memory",
    "pmid": 251659300,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.inactive_anon",
    "text-oneline": "anonymous Inactive list LRU memory",
    "text-help": "anonymous Inactive list LRU memory",
    "pmid": 251659301,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.active_file",
    "text-oneline": "file-backed Active list LRU memory",
    "text-help": "file-backed Active list LRU memory",
    "pmid": 251659302,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.inactive_file",
    "text-oneline": "file-backed Inactive list LRU memory",
    "text-help": "file-backed Inactive list LRU memory",
    "pmid": 251659303,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.unevictable",
    "text-oneline": "kbytes of memory that is unevictable",
    "text-help": "kbytes of memory that is unevictable",
    "pmid": 251659304,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.mlocked",
    "text-oneline": "kbytes of memory that is pinned via mlock()",
    "text-help": "kbytes of memory that is pinned via mlock()",
    "pmid": 251659305,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.shmem",
    "text-oneline": "kbytes of shmem",
    "text-help": "kbytes of shmem",
    "pmid": 251659306,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.kernelStack",
    "text-oneline": "kbytes of memory used for kernel stacks",
    "text-help": "kbytes of memory used for kernel stacks",
    "pmid": 251659307,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesTotal",
    "text-oneline": "a count of total hugepages",
    "text-help": "a count of total hugepages",
    "pmid": 251659308,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesFree",
    "text-oneline": "a count of free hugepages",
    "text-help": "a count of free hugepages",
    "pmid": 251659309,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesRsvd",
    "text-oneline": "a count of reserved hugepages",
    "text-help": "a count of reserved hugepages",
    "pmid": 251659310,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesSurp",
    "text-oneline": "a count of surplus hugepages",
    "text-help": "a count of surplus hugepages",
    "pmid": 251659311,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.util.directMap4k",
    "text-oneline": "amount of memory that is directly mapped in 4kB pages",
    "text-help": "amount of memory that is directly mapped in 4kB pages",
    "pmid": 251659312,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.directMap2M",
    "text-oneline": "amount of memory that is directly mapped in 2MB pages",
    "text-help": "amount of memory that is directly mapped in 2MB pages",
    "pmid": 251659313,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.vmallocTotal",
    "text-oneline": "amount of kernel memory allocated via vmalloc",
    "text-help": "amount of kernel memory allocated via vmalloc",
    "pmid": 251659314,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.vmallocUsed",
    "text-oneline": "amount of used vmalloc memory",
    "text-help": "amount of used vmalloc memory",
    "pmid": 251659315,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.vmallocChunk",
    "text-oneline": "amount of vmalloc chunk memory",
    "text-help": "amount of vmalloc chunk memory",
    "pmid": 251659316,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.mmap_copy",
    "text-oneline": "amount of mmap_copy space (non-MMU kernels only)",
    "text-help": "amount of mmap_copy space (non-MMU kernels only)",
    "pmid": 251659317,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.quicklists",
    "text-oneline": "amount of memory in the per-CPU quicklists",
    "text-help": "amount of memory in the per-CPU quicklists",
    "pmid": 251659318,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.corrupthardware",
    "text-oneline": "amount of memory in hardware corrupted pages",
    "text-help": "amount of memory in hardware corrupted pages",
    "pmid": 251659319,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.anonhugepages",
    "text-oneline": "amount of memory in anonymous huge pages",
    "text-help": "amount of memory in anonymous huge pages",
    "pmid": 251659320,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.directMap1G",
    "text-oneline": "amount of memory that is directly mapped in 1GB pages",
    "text-help": "amount of memory that is directly mapped in 1GB pages",
    "pmid": 251659321,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.available",
    "text-oneline": "available memory from /proc/meminfo",
    "text-help": "The amount of memory that is available for a new workload,\nwithout pushing the system into swap. Estimated from MemFree,\nActive(file), Inactive(file), and SReclaimable, as well as the \"low\"\nwatermarks from /proc/zoneinfo.",
    "pmid": 251659322,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesTotalBytes",
    "text-oneline": "amount of memory in total hugepages",
    "text-help": "amount of memory in total hugepages",
    "pmid": 251659324,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesFreeBytes",
    "text-oneline": "amount of memory in free hugepages",
    "text-help": "amount of memory in free hugepages",
    "pmid": 251659325,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesRsvdBytes",
    "text-oneline": "amount of memory in reserved hugepages",
    "text-help": "amount of memory in reserved hugepages",
    "pmid": 251659326,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.util.hugepagesSurpBytes",
    "text-oneline": "amount of memory in surplus hugepages",
    "text-help": "\nUser memory (Kbytes) in pages not backed by files, e.g. from malloc()",
    "pmid": 251659327,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.numa.max_bandwidth",
    "text-oneline": "maximum memory bandwidth supported on each numa node",
    "text-help": "Maximum memory bandwidth supported on each numa node. It makes use of a\nbandwith.conf file which has the bandwidth information for each node :\nnode_num:bandwidth\nThe node_num must match with any node in sysfs/devices/system/node directory.\nAnd, the bandwidth is expressed in terms of MBps. This config file should be\nfilled up manually after running some bandwidth saturation benchmark tools.",
    "pmid": 251695142,
    "indom": 251658259,
    "sem": "discrete",
    "units": "Mbyte / sec",
    "type": "DOUBLE"
  },
  {
    "name": "mem.numa.util.total",
    "text-oneline": "per-node total memory",
    "text-help": "per-node total memory",
    "pmid": 251695104,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.free",
    "text-oneline": "per-node free memory",
    "text-help": "per-node free memory",
    "pmid": 251695105,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.used",
    "text-oneline": "per-node used memory",
    "text-help": "per-node used memory",
    "pmid": 251695106,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.active",
    "text-oneline": "per-node Active list LRU memory",
    "text-help": "per-node Active list LRU memory",
    "pmid": 251695107,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.inactive",
    "text-oneline": "per-node Inactive list LRU memory",
    "text-help": "per-node Inactive list LRU memory",
    "pmid": 251695108,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.active_anon",
    "text-oneline": "per-node anonymous Active list LRU memory",
    "text-help": "per-node anonymous Active list LRU memory",
    "pmid": 251695109,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.inactive_anon",
    "text-oneline": "per-node anonymous Inactive list LRU memory",
    "text-help": "per-node anonymous Inactive list LRU memory",
    "pmid": 251695110,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.active_file",
    "text-oneline": "per-node file-backed Active list LRU memory",
    "text-help": "per-node file-backed Active list LRU memory",
    "pmid": 251695111,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.inactive_file",
    "text-oneline": "per-node file-backed Inactive list LRU memory",
    "text-help": "per-node file-backed Inactive list LRU memory",
    "pmid": 251695112,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.highTotal",
    "text-oneline": "per-node highmem total",
    "text-help": "per-node highmem total",
    "pmid": 251695113,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.highFree",
    "text-oneline": "per-node highmem free",
    "text-help": "per-node highmem free",
    "pmid": 251695114,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.lowTotal",
    "text-oneline": "per-node lowmem total",
    "text-help": "per-node lowmem total",
    "pmid": 251695115,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.lowFree",
    "text-oneline": "per-node lowmem free",
    "text-help": "per-node lowmem free",
    "pmid": 251695116,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.unevictable",
    "text-oneline": "per-node Unevictable memory",
    "text-help": "per-node Unevictable memory",
    "pmid": 251695117,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.mlocked",
    "text-oneline": "per-node count of Mlocked memory",
    "text-help": "per-node count of Mlocked memory",
    "pmid": 251695118,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.dirty",
    "text-oneline": "per-node dirty memory",
    "text-help": "per-node dirty memory",
    "pmid": 251695119,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.writeback",
    "text-oneline": "per-node count of memory locked for writeback to stable storage",
    "text-help": "per-node count of memory locked for writeback to stable storage",
    "pmid": 251695120,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.filePages",
    "text-oneline": "per-node count of memory backed by files",
    "text-help": "per-node count of memory backed by files",
    "pmid": 251695121,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.mapped",
    "text-oneline": "per-node mapped memory",
    "text-help": "per-node mapped memory",
    "pmid": 251695122,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.anonpages",
    "text-oneline": "per-node anonymous memory",
    "text-help": "per-node anonymous memory",
    "pmid": 251695123,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.shmem",
    "text-oneline": "per-node amount of shared memory",
    "text-help": "per-node amount of shared memory",
    "pmid": 251695124,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.kernelStack",
    "text-oneline": "per-node memory used as kernel stacks",
    "text-help": "per-node memory used as kernel stacks",
    "pmid": 251695125,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.pageTables",
    "text-oneline": "per-node memory used for pagetables",
    "text-help": "per-node memory used for pagetables",
    "pmid": 251695126,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.NFS_Unstable",
    "text-oneline": "per-node memory holding NFS data that needs writeback",
    "text-help": "per-node memory holding NFS data that needs writeback",
    "pmid": 251695127,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.bounce",
    "text-oneline": "per-node memory used for bounce buffers",
    "text-help": "per-node memory used for bounce buffers",
    "pmid": 251695128,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.writebackTmp",
    "text-oneline": "per-node temporary memory used for writeback",
    "text-help": "per-node temporary memory used for writeback",
    "pmid": 251695129,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.slab",
    "text-oneline": "per-node memory used for slab objects",
    "text-help": "per-node memory used for slab objects",
    "pmid": 251695130,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.slabReclaimable",
    "text-oneline": "per-node memory used for slab objects that can be reclaimed",
    "text-help": "per-node memory used for slab objects that can be reclaimed",
    "pmid": 251695131,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.slabUnreclaimable",
    "text-oneline": "per-node memory used for slab objects that is unreclaimable",
    "text-help": "per-node memory used for slab objects that is unreclaimable",
    "pmid": 251695132,
    "indom": 251658259,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesTotal",
    "text-oneline": "per-node total count of hugepages",
    "text-help": "per-node total count of hugepages",
    "pmid": 251695133,
    "indom": 251658259,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesFree",
    "text-oneline": "per-node count of free hugepages",
    "text-help": "per-node count of free hugepages",
    "pmid": 251695134,
    "indom": 251658259,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesSurp",
    "text-oneline": "per-node count of surplus hugepages",
    "text-help": "per-node count of surplus hugepages",
    "pmid": 251695135,
    "indom": 251658259,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesTotalBytes",
    "text-oneline": "per-node total amount of hugepages memory",
    "text-help": "per-node total amount of hugepages memory",
    "pmid": 251695143,
    "indom": 251658259,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesFreeBytes",
    "text-oneline": "per-node amount of free hugepages memory",
    "text-help": "per-node amount of free hugepages memory",
    "pmid": 251695144,
    "indom": 251658259,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.numa.util.hugepagesSurpBytes",
    "text-oneline": "per-node amount of surplus hugepages memory",
    "text-help": "per-node amount of surplus hugepages memory",
    "pmid": 251695145,
    "indom": 251658259,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.hit",
    "text-oneline": "per-node count of times a task wanted alloc on local node and succeeded",
    "text-help": "per-node count of times a task wanted alloc on local node and succeeded",
    "pmid": 251695136,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.miss",
    "text-oneline": "per-node count of times a task wanted alloc on local node but got another node",
    "text-help": "per-node count of times a task wanted alloc on local node but got another node",
    "pmid": 251695137,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.foreign",
    "text-oneline": "count of times a task on another node alloced on that node, but got this node",
    "text-help": "count of times a task on another node alloced on that node, but got this node",
    "pmid": 251695138,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.interleave_hit",
    "text-oneline": "count of times interleaving wanted to allocate on this node and succeeded",
    "text-help": "count of times interleaving wanted to allocate on this node and succeeded",
    "pmid": 251695139,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.local_node",
    "text-oneline": "count of times a process ran on this node and got memory on this node",
    "text-help": "count of times a process ran on this node and got memory on this node",
    "pmid": 251695140,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.numa.alloc.other_node",
    "text-oneline": "count of times a process ran on this node and got memory from another node",
    "text-help": "count of times a process ran on this node and got memory from another node",
    "pmid": 251695141,
    "indom": 251658259,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.allocstall",
    "text-oneline": "direct reclaim calls",
    "text-help": "Count of direct reclaim calls since boot, from /proc/vmstat",
    "pmid": 251686947,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.balloon_deflate",
    "text-oneline": "number of virt guest balloon page deflations",
    "text-help": "number of virt guest balloon page deflations",
    "pmid": 251687015,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.balloon_inflate",
    "text-oneline": "count of virt guest balloon page inflations",
    "text-help": "count of virt guest balloon page inflations",
    "pmid": 251687016,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.balloon_migrate",
    "text-oneline": "number of virt guest balloon page migrations",
    "text-help": "number of virt guest balloon page migrations",
    "pmid": 251687017,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_blocks_moved",
    "text-oneline": "count of compact blocks moved",
    "text-help": "count of compact blocks moved",
    "pmid": 251686969,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_daemon_wake",
    "text-oneline": "number of times the memory compaction daemon was woken",
    "text-help": "number of times the memory compaction daemon was woken",
    "pmid": 251687018,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_fail",
    "text-oneline": "count of unsuccessful compactions for high order allocations",
    "text-help": "count of unsuccessful compactions for high order allocations",
    "pmid": 251686970,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_free_scanned",
    "text-oneline": "count of pages scanned for freeing by compaction daemon",
    "text-help": "count of pages scanned for freeing by compaction daemon",
    "pmid": 251687019,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_migrate_scanned",
    "text-oneline": "count of pages scanned for migration by compaction daemon",
    "text-help": "count of pages scanned for migration by compaction daemon",
    "pmid": 251687020,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_pagemigrate_failed",
    "text-oneline": "count of pages unsuccessfully compacted",
    "text-help": "count of pages unsuccessfully compacted",
    "pmid": 251686971,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_pages_moved",
    "text-oneline": "count of pages successfully moved for compaction",
    "text-help": "count of pages successfully moved for compaction",
    "pmid": 251686972,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_stall",
    "text-oneline": "count of failures to even start compacting",
    "text-help": "count of failures to even start compacting",
    "pmid": 251686973,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_success",
    "text-oneline": "count of successful compactions for high order allocations",
    "text-help": "count of successful compactions for high order allocations",
    "pmid": 251686974,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.drop_pagecache",
    "text-oneline": "count of calls to drop page cache pages",
    "text-help": "count of calls to drop page cache pages",
    "pmid": 251687021,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.drop_slab",
    "text-oneline": "count of calls to drop slab cache pages",
    "text-help": "count of calls to drop slab cache pages",
    "pmid": 251687022,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.htlb_buddy_alloc_fail",
    "text-oneline": "huge TLB page buddy allocation failures",
    "text-help": "Count of huge TLB page buddy allocation failures, from /proc/vmstat",
    "pmid": 251686955,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.htlb_buddy_alloc_success",
    "text-oneline": "huge TLB page buddy allocation successes",
    "text-help": "Count of huge TLB page buddy allocation successes, from /proc/vmstat",
    "pmid": 251686956,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.kswapd_inodesteal",
    "text-oneline": "pages reclaimed via kswapd inode freeing",
    "text-help": "Count of pages reclaimed via kswapd inode freeing since boot, from\n/proc/vmstat",
    "pmid": 251686945,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.kswapd_low_wmark_hit_quickly",
    "text-oneline": "count of times low watermark reached quickly",
    "text-help": "Count of times kswapd reached low watermark quickly, from /proc/vmstat",
    "pmid": 251686999,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.kswapd_high_wmark_hit_quickly",
    "text-oneline": "count of times high watermark reached quickly",
    "text-help": "Count of times kswapd reached high watermark quickly, from /proc/vmstat",
    "pmid": 251687000,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.kswapd_skip_congestion_wait",
    "text-oneline": "count of times kswapd skipped waiting on device congestion",
    "text-help": "Count of times kswapd skipped waiting due to device congestion as a\nresult of being under the low watermark, from /proc/vmstat",
    "pmid": 251687001,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.kswapd_steal",
    "text-oneline": "pages reclaimed by kswapd",
    "text-help": "Count of pages reclaimed by kswapd since boot, from /proc/vmstat",
    "pmid": 251686944,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_active_anon",
    "text-oneline": "number of active anonymous memory pages",
    "text-help": "number of active anonymous memory pages",
    "pmid": 251686957,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_active_file",
    "text-oneline": "number of active file memory memory pages",
    "text-help": "number of active file memory memory pages",
    "pmid": 251686958,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_anon_pages",
    "text-oneline": "number of anonymous mapped pagecache pages",
    "text-help": "Instantaneous number of anonymous mapped pagecache pages, from /proc/vmstat\nSee also mem.vmstat.mapped for other mapped pages.",
    "pmid": 251686951,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_anon_transparent_hugepages",
    "text-oneline": "number of anonymous transparent huge pages",
    "text-help": "Instantaneous number of anonymous transparent huge pages, from /proc/vmstat",
    "pmid": 251687002,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_bounce",
    "text-oneline": "number of bounce buffer pages",
    "text-help": "Instantaneous number of bounce buffer pages, from /proc/vmstat",
    "pmid": 251686952,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_dirtied",
    "text-oneline": "count of pages dirtied",
    "text-help": "Count of pages entering dirty state, from /proc/vmstat",
    "pmid": 251687003,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_dirty",
    "text-oneline": "number of pages in dirty state",
    "text-help": "Instantaneous number of pages in dirty state, from /proc/vmstat",
    "pmid": 251686912,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_dirty_background_threshold",
    "text-oneline": "background writeback threshold",
    "text-help": "background writeback threshold",
    "pmid": 251687004,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_dirty_threshold",
    "text-oneline": "dirty throttling threshold",
    "text-help": "dirty throttling threshold",
    "pmid": 251687005,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_free_cma",
    "text-oneline": "count of free Contiguous Memory Allocator pages",
    "text-help": "count of free Contiguous Memory Allocator pages",
    "pmid": 251687023,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_free_pages",
    "text-oneline": "number of free pages",
    "text-help": "number of free pages",
    "pmid": 251686959,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_inactive_anon",
    "text-oneline": "number of inactive anonymous memory pages",
    "text-help": "number of inactive anonymous memory pages",
    "pmid": 251686960,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_inactive_file",
    "text-oneline": "number of inactive file memory pages",
    "text-help": "number of inactive file memory pages",
    "pmid": 251686961,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_isolated_anon",
    "text-oneline": "number of isolated anonymous memory pages",
    "text-help": "number of isolated anonymous memory pages",
    "pmid": 251686962,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_isolated_file",
    "text-oneline": "number of isolated file memory pages",
    "text-help": "number of isolated file memory pages",
    "pmid": 251686963,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_kernel_stack",
    "text-oneline": "number of pages of kernel stack",
    "text-help": "number of pages of kernel stack",
    "pmid": 251686964,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_mapped",
    "text-oneline": "number of mapped pagecache pages",
    "text-help": "Instantaneous number of mapped pagecache pages, from /proc/vmstat\nSee also mem.vmstat.nr_anon for anonymous mapped pages.",
    "pmid": 251686916,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_mlock",
    "text-oneline": "number of pages under mlock",
    "text-help": "number of pages under mlock",
    "pmid": 251686965,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_pages_scanned",
    "text-oneline": "count of pages scanned during page reclaim",
    "text-help": "count of pages scanned during page reclaim",
    "pmid": 251687024,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_page_table_pages",
    "text-oneline": "number of page table pages",
    "text-help": "Instantaneous number of page table pages, from /proc/vmstat",
    "pmid": 251686915,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_shmem",
    "text-oneline": "number of shared memory pages",
    "text-help": "number of shared memory pages",
    "pmid": 251686966,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_slab",
    "text-oneline": "number of slab pages",
    "text-help": "Instantaneous number of slab pages, from /proc/vmstat\nThis counter was retired in 2.6.18 kernels, and is now the sum of\nmem.vmstat.nr_slab_reclaimable and mem.vmstat.nr_slab_unreclaimable.",
    "pmid": 251686917,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_slab_reclaimable",
    "text-oneline": "reclaimable slab pages",
    "text-help": "Instantaneous number of reclaimable slab pages, from /proc/vmstat.",
    "pmid": 251686949,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_slab_unreclaimable",
    "text-oneline": "unreclaimable slab pages",
    "text-help": "Instantaneous number of unreclaimable slab pages, from /proc/vmstat.",
    "pmid": 251686950,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_unevictable",
    "text-oneline": "number of unevictable pages",
    "text-help": "number of unevictable pages",
    "pmid": 251686967,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_unstable",
    "text-oneline": "number of pages in unstable state",
    "text-help": "Instantaneous number of pages in unstable state, from /proc/vmstat",
    "pmid": 251686914,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_vmscan_immediate_reclaim",
    "text-oneline": "prioritise for reclaim when writeback ends",
    "text-help": "prioritise for reclaim when writeback ends",
    "pmid": 251687025,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_vmscan_write",
    "text-oneline": "pages written by VM scanner from LRU",
    "text-help": "Count of pages written from the LRU by the VM scanner, from /proc/vmstat.\nThe VM is supposed to minimise the number of pages which get written\nfrom the LRU (for IO scheduling efficiency, and for high reclaim-success\nrates).",
    "pmid": 251686954,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_writeback",
    "text-oneline": "number of pages in writeback state",
    "text-help": "Instantaneous number of pages in writeback state, from /proc/vmstat",
    "pmid": 251686913,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_writeback_temp",
    "text-oneline": "number of temporary writeback pages",
    "text-help": "number of temporary writeback pages",
    "pmid": 251686968,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_written",
    "text-oneline": "count of pages written out",
    "text-help": "Count of pages written out, from /proc/vmstat",
    "pmid": 251687006,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_foreign",
    "text-oneline": "count of foreign NUMA zone allocations",
    "text-help": "count of foreign NUMA zone allocations",
    "pmid": 251687007,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_hint_faults",
    "text-oneline": "count of page migrations from NUMA PTE fault hints",
    "text-help": "count of page migrations from NUMA PTE fault hints",
    "pmid": 251687064,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_hint_faults_local",
    "text-oneline": "count of NUMA PTE fault hints satisfied locally",
    "text-help": "count of NUMA PTE fault hints satisfied locally",
    "pmid": 251687065,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_hit",
    "text-oneline": "count of successful allocations from preferred NUMA zone",
    "text-help": "count of successful allocations from preferred NUMA zone",
    "pmid": 251687008,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_huge_pte_updates",
    "text-oneline": "count of NUMA huge page table entry updates",
    "text-help": "count of NUMA huge page table entry updates",
    "pmid": 251687063,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_interleave",
    "text-oneline": "count of interleaved NUMA allocations",
    "text-help": "count of interleaved NUMA allocations",
    "pmid": 251687009,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_local",
    "text-oneline": "count of successful allocations from local NUMA zone",
    "text-help": "count of successful allocations from local NUMA zone",
    "pmid": 251687010,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_miss",
    "text-oneline": "count of unsuccessful allocations from preferred NUMA zona",
    "text-help": "count of unsuccessful allocations from preferred NUMA zona",
    "pmid": 251687011,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_other",
    "text-oneline": "count of unsuccessful allocations from local NUMA zone",
    "text-help": "count of unsuccessful allocations from local NUMA zone",
    "pmid": 251687012,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_pages_migrated",
    "text-oneline": "count of NUMA page migrations",
    "text-help": "count of NUMA page migrations",
    "pmid": 251687026,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.numa_pte_updates",
    "text-oneline": "count of NUMA page table entry updates",
    "text-help": "count of NUMA page table entry updates",
    "pmid": 251687027,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pageoutrun",
    "text-oneline": "kswapd calls to page reclaim",
    "text-help": "Count of kswapd calls to page reclaim since boot, from /proc/vmstat",
    "pmid": 251686946,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgactivate",
    "text-oneline": "pages moved from inactive to active",
    "text-help": "Count of pages moved from inactive to active since boot, from /proc/vmstat",
    "pmid": 251686926,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgalloc_dma",
    "text-oneline": "dma mem page allocations",
    "text-help": "Count of dma mem page allocations since boot, from /proc/vmstat",
    "pmid": 251686924,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgalloc_dma32",
    "text-oneline": "dma32 mem page allocations",
    "text-help": "Count of dma32 mem page allocations since boot, from /proc/vmstat",
    "pmid": 251686975,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgalloc_high",
    "text-oneline": "high mem page allocations",
    "text-help": "Count of high mem page allocations since boot, from /proc/vmstat",
    "pmid": 251686922,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgalloc_movable",
    "text-oneline": "movable mem page allocations",
    "text-help": "Count of movable mem page allocations since boot, from /proc/vmstat",
    "pmid": 251686976,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgalloc_normal",
    "text-oneline": "normal mem page allocations",
    "text-help": "Count of normal mem page allocations since boot, from /proc/vmstat",
    "pmid": 251686923,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrefill_dma32",
    "text-oneline": "dma32 mem pages inspected in refill_inactive_zone",
    "text-help": "Count of dma32 mem pages inspected in refill_inactive_zone since boot,\nfrom /proc/vmstat",
    "pmid": 251686977,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrefill_movable",
    "text-oneline": "movable mem pages inspected in refill_inactive_zone",
    "text-help": "Count of movable mem pages inspected in refill_inactive_zone since boot,\nfrom /proc/vmstat",
    "pmid": 251686978,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgdeactivate",
    "text-oneline": "pages moved from active to inactive",
    "text-help": "Count of pages moved from active to inactive since boot, from /proc/vmstat",
    "pmid": 251686927,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgfault",
    "text-oneline": "page major and minor fault operations",
    "text-help": "Count of page major and minor fault operations since boot, from /proc/vmstat",
    "pmid": 251686928,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgfree",
    "text-oneline": "page free operations",
    "text-help": "Count of page free operations since boot, from /proc/vmstat",
    "pmid": 251686925,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pginodesteal",
    "text-oneline": "pages reclaimed via inode freeing",
    "text-help": "Count of pages reclaimed via inode freeing since boot, from /proc/vmstat",
    "pmid": 251686942,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pglazyfreed",
    "text-oneline": "count of pages lazily freed",
    "text-help": "count of pages lazily freed",
    "pmid": 251687028,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgmajfault",
    "text-oneline": "major page fault operations",
    "text-help": "Count of major page fault operations since boot, from /proc/vmstat",
    "pmid": 251686929,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgmigrate_fail",
    "text-oneline": "count of unsuccessful NUMA page migrations",
    "text-help": "count of unsuccessful NUMA page migrations",
    "pmid": 251687029,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgmigrate_success",
    "text-oneline": "count of successful NUMA page migrations",
    "text-help": "count of successful NUMA page migrations",
    "pmid": 251687030,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgpgin",
    "text-oneline": "page in operations",
    "text-help": "Count of page in operations since boot, from /proc/vmstat",
    "pmid": 251686918,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgpgout",
    "text-oneline": "page out operations",
    "text-help": "Count of page out operations since boot, from /proc/vmstat",
    "pmid": 251686919,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrefill_dma",
    "text-oneline": "dma mem pages inspected in refill_inactive_zone",
    "text-help": "Count of dma mem pages inspected in refill_inactive_zone since boot,\nfrom /proc/vmstat",
    "pmid": 251686932,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrefill_high",
    "text-oneline": "high mem pages inspected in refill_inactive_zone",
    "text-help": "Count of high mem pages inspected in refill_inactive_zone since boot,\nfrom /proc/vmstat",
    "pmid": 251686930,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrefill_normal",
    "text-oneline": "normal mem pages inspected in refill_inactive_zone",
    "text-help": "Count of normal mem pages inspected in refill_inactive_zone since boot,\nfrom /proc/vmstat",
    "pmid": 251686931,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgrotated",
    "text-oneline": "pages rotated to tail of the LRU",
    "text-help": "Count of pages rotated to tail of the LRU since boot, from /proc/vmstat",
    "pmid": 251686948,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct",
    "text-oneline": "directly scanned mem pages",
    "text-help": "Count of mem pages scanned directly since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687058,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_dma",
    "text-oneline": "dma mem pages scanned",
    "text-help": "Count of dma mem pages scanned since boot, from /proc/vmstat",
    "pmid": 251686941,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_dma32",
    "text-oneline": "dma32 mem pages scanned",
    "text-help": "Count of dma32 mem pages scanned since boot, from /proc/vmstat",
    "pmid": 251686979,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_high",
    "text-oneline": "high mem pages scanned",
    "text-help": "Count of high mem pages scanned since boot, from /proc/vmstat",
    "pmid": 251686939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_movable",
    "text-oneline": "movable mem pages scanned",
    "text-help": "Count of movable mem pages scanned since boot, from /proc/vmstat",
    "pmid": 251686980,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_normal",
    "text-oneline": "normal mem pages scanned",
    "text-help": "Count of normal mem pages scanned since boot, from /proc/vmstat",
    "pmid": 251686940,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_direct_throttle",
    "text-oneline": "throttled direct scanned mem pages",
    "text-help": "Count of throttled mem pages scanned directly since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687059,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd",
    "text-oneline": "mem pages scanned by kswapd",
    "text-help": "Count of mem pages scanned by kswapd since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687060,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd_dma",
    "text-oneline": "dma mem pages scanned by kswapd",
    "text-help": "Count of dma mem pages scanned by kswapd since boot, from /proc/vmstat",
    "pmid": 251686938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd_dma32",
    "text-oneline": "dma32 mem pages scanned by kswapd",
    "text-help": "Count of dma32 mem pages scanned by kswapd since boot, from /proc/vmstat",
    "pmid": 251686981,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd_high",
    "text-oneline": "high mem pages scanned by kswapd",
    "text-help": "Count of high mem pages scanned by kswapd since boot, from /proc/vmstat",
    "pmid": 251686936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd_movable",
    "text-oneline": "movable mem pages scanned by kswapd",
    "text-help": "Count of movable mem pages scanned by kswapd since boot, from /proc/vmstat",
    "pmid": 251686982,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgscan_kswapd_normal",
    "text-oneline": "normal mem pages scanned by kswapd",
    "text-help": "Count of normal mem pages scanned by kswapd since boot, from /proc/vmstat",
    "pmid": 251686937,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_dma",
    "text-oneline": "dma mem pages reclaimed",
    "text-help": "Count of dma mem pages reclaimed since boot, from /proc/vmstat",
    "pmid": 251686935,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_dma32",
    "text-oneline": "dma32 mem pages reclaimed",
    "text-help": "Count of dma32 mem pages reclaimed since boot, from /proc/vmstat",
    "pmid": 251686983,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_high",
    "text-oneline": "high mem pages reclaimed",
    "text-help": "Count of high mem pages reclaimed since boot, from /proc/vmstat",
    "pmid": 251686933,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_movable",
    "text-oneline": "movable mem pages reclaimed",
    "text-help": "Count of movable mem pages reclaimed since boot, from /proc/vmstat",
    "pmid": 251686984,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_normal",
    "text-oneline": "normal mem pages reclaimed",
    "text-help": "Count of normal mem pages reclaimed since boot, from /proc/vmstat",
    "pmid": 251686934,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_kswapd",
    "text-oneline": "mem pages reclaimed by kswapd",
    "text-help": "Count of mem pages reclaimed by kswapd since boot, from /proc/vmstat",
    "pmid": 251687062,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_kswapd_dma",
    "text-oneline": "dma mem pages reclaimed by kswapd",
    "text-help": "Count of dma mem pages reclaimed by kswapd since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687050,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_kswapd_dma32",
    "text-oneline": "dma32 mem pages reclaimed by kswapd",
    "text-help": "Count of dma32 mem pages reclaimed by kswapd since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687051,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_kswapd_normal",
    "text-oneline": "normal mem pages reclaimed by kswapd",
    "text-help": "Count of normal mem pages reclaimed by kswapd since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687052,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_kswapd_movable",
    "text-oneline": "movable mem pages reclaimed by kswapd",
    "text-help": "Count of movable mem pages reclaimed by kswapd since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687053,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_direct",
    "text-oneline": "mem pages directly reclaimed",
    "text-help": "Count of mem pages directly reclaimed since boot, from /proc/vmstat",
    "pmid": 251687061,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_direct_dma",
    "text-oneline": "dma mem pages reclaimed",
    "text-help": "Count of dma mem pages reclaimed since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687054,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_direct_dma32",
    "text-oneline": "dma32 mem pages reclaimed",
    "text-help": "Count of dma32 mem pages reclaimed since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687055,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_direct_normal",
    "text-oneline": "normal mem pages reclaimed",
    "text-help": "Count of normal mem pages reclaimed since boot, from /proc/vmstat\nsince Linux 3.4",
    "pmid": 251687056,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pgsteal_direct_movable",
    "text-oneline": "movable mem pages reclaimed",
    "text-help": "Count of movable mem pages reclaimed since boot, from /proc/vmstat\nsince Linux 2.6.23",
    "pmid": 251687057,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pswpin",
    "text-oneline": "pages swapped in",
    "text-help": "Count of pages swapped in since boot, from /proc/vmstat",
    "pmid": 251686920,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.pswpout",
    "text-oneline": "pages swapped out",
    "text-help": "Count of pages swapped out since boot, from /proc/vmstat",
    "pmid": 251686921,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.slabs_scanned",
    "text-oneline": "slab pages scanned",
    "text-help": "Count of slab pages scanned since boot, from /proc/vmstat",
    "pmid": 251686943,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_collapse_alloc",
    "text-oneline": "transparent huge page collapse allocations",
    "text-help": "transparent huge page collapse allocations",
    "pmid": 251686987,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_collapse_alloc_failed",
    "text-oneline": "transparent huge page collapse failures",
    "text-help": "transparent huge page collapse failures",
    "pmid": 251686988,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_deferred_split_page",
    "text-oneline": "count of huge page enqueues for splitting",
    "text-help": "count of huge page enqueues for splitting",
    "pmid": 251687031,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_fault_alloc",
    "text-oneline": "transparent huge page fault allocations",
    "text-help": "transparent huge page fault allocations",
    "pmid": 251686985,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_fault_fallback",
    "text-oneline": "transparent huge page fault fallbacks",
    "text-help": "transparent huge page fault fallbacks",
    "pmid": 251686986,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_split",
    "text-oneline": "count of transparent huge page splits",
    "text-help": "count of transparent huge page splits",
    "pmid": 251686989,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_split_page",
    "text-oneline": "count of huge page splits into base pages",
    "text-help": "count of huge page splits into base pages",
    "pmid": 251687032,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_split_page_failed",
    "text-oneline": "count of failures to split a huge page",
    "text-help": "count of failures to split a huge page",
    "pmid": 251687033,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_split_pmd",
    "text-oneline": "count of times a PMD was split into table of PTEs",
    "text-help": "This can happen, for instance, when an application calls mprotect() or\nmunmap() on part of huge page. It doesn't split huge page, only the page\ntable entry.",
    "pmid": 251687034,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_zero_page_alloc",
    "text-oneline": "count of transparent huge page zeroed page allocations",
    "text-help": "count of transparent huge page zeroed page allocations",
    "pmid": 251687013,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_zero_page_alloc_failed",
    "text-oneline": "count of transparent huge page zeroed page allocation failures",
    "text-help": "count of transparent huge page zeroed page allocation failures",
    "pmid": 251687014,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_cleared",
    "text-oneline": "count of unevictable pages cleared",
    "text-help": "count of unevictable pages cleared",
    "pmid": 251686990,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_culled",
    "text-oneline": "count of unevictable pages culled",
    "text-help": "count of unevictable pages culled",
    "pmid": 251686991,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_mlocked",
    "text-oneline": "count of mlocked unevictable pages",
    "text-help": "count of mlocked unevictable pages",
    "pmid": 251686992,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_mlockfreed",
    "text-oneline": "count of unevictable pages mlock freed",
    "text-help": "count of unevictable pages mlock freed",
    "pmid": 251686993,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_munlocked",
    "text-oneline": "count of unevictable pages munlocked",
    "text-help": "count of unevictable pages munlocked",
    "pmid": 251686994,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_rescued",
    "text-oneline": "count of unevictable pages rescued",
    "text-help": "count of unevictable pages rescued",
    "pmid": 251686995,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_scanned",
    "text-oneline": "count of unevictable pages scanned",
    "text-help": "count of unevictable pages scanned",
    "pmid": 251686996,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.unevictable_pgs_stranded",
    "text-oneline": "count of unevictable pages stranded",
    "text-help": "count of unevictable pages stranded",
    "pmid": 251686997,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.workingset_activate",
    "text-oneline": "count of page activations to form the working set",
    "text-help": "count of page activations to form the working set",
    "pmid": 251687035,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.workingset_nodereclaim",
    "text-oneline": "count of NUMA node working set page reclaims",
    "text-help": "count of NUMA node working set page reclaims",
    "pmid": 251687036,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.workingset_refault",
    "text-oneline": "count of refaults of previously evicted pages",
    "text-help": "count of refaults of previously evicted pages",
    "pmid": 251687037,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.zone_reclaim_failed",
    "text-oneline": "number of zone reclaim failures",
    "text-help": "number of zone reclaim failures",
    "pmid": 251686998,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.compact_isolated",
    "text-oneline": "count of page isolations for memory compaction",
    "text-help": "count of page isolations for memory compaction",
    "pmid": 251687038,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_shmem_hugepages",
    "text-oneline": "number of huge pages used for shared memory",
    "text-help": "number of huge pages used for shared memory",
    "pmid": 251687039,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_shmem_pmdmapped",
    "text-oneline": "number of huge page PMD mappings",
    "text-help": "number of huge page PMD mappings",
    "pmid": 251687040,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_inactive_anon",
    "text-oneline": "number of inactive anonymous memory pages in zones",
    "text-help": "number of inactive anonymous memory pages in zones",
    "pmid": 251687041,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_active_anon",
    "text-oneline": "number of inactive file memory pages in zones",
    "text-help": "number of inactive file memory pages in zones",
    "pmid": 251687042,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_inactive_file",
    "text-oneline": "number of isolated anonymous memory pages in zones",
    "text-help": "number of isolated anonymous memory pages in zones",
    "pmid": 251687043,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_active_file",
    "text-oneline": "number of isolated file memory pages in zones",
    "text-help": "number of isolated file memory pages in zones",
    "pmid": 251687044,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_unevictable",
    "text-oneline": "number of unevictable memory pages in zones",
    "text-help": "number of unevictable memory pages in zones",
    "pmid": 251687045,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zone_write_pending",
    "text-oneline": "count of dirty, writeback and unstable pages",
    "text-help": "count of dirty, writeback and unstable pages",
    "pmid": 251687046,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.nr_zspages",
    "text-oneline": "number of compressed pages",
    "text-help": "number of compressed pages",
    "pmid": 251687047,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_file_alloc",
    "text-oneline": "count of times huge pages were allocated and put in page cache",
    "text-help": "count of times huge pages were allocated and put in page cache",
    "pmid": 251687048,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.vmstat.thp_file_mapped",
    "text-oneline": "count of times huge pages were used for file mappings",
    "text-help": "count of times huge pages were used for file mappings",
    "pmid": 251687049,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.buddyinfo.pages",
    "text-oneline": "fragmented page count from /proc/buddyinfo",
    "text-help": "fragmented page count from /proc/buddyinfo",
    "pmid": 251726848,
    "indom": 251658271,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.buddyinfo.total",
    "text-oneline": "page fragmentation size from /proc/buddyinfo",
    "text-help": "page fragmentation size from /proc/buddyinfo",
    "pmid": 251726849,
    "indom": 251658271,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.slabinfo.objects.active",
    "text-oneline": "number of active objects in each cache",
    "text-help": "number of active objects in each cache",
    "pmid": 251678720,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.slabinfo.objects.total",
    "text-oneline": "total number of objects in each cache",
    "text-help": "total number of objects in each cache",
    "pmid": 251678721,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.slabinfo.objects.size",
    "text-oneline": "size of individual objects of each cache",
    "text-help": "size of individual objects of each cache",
    "pmid": 251678722,
    "indom": 251658252,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "mem.slabinfo.slabs.active",
    "text-oneline": "number of active slabs comprising each cache",
    "text-help": "number of active slabs comprising each cache",
    "pmid": 251678723,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "mem.slabinfo.slabs.total",
    "text-oneline": "total number of slabs comprising each cache",
    "text-help": "total number of slabs comprising each cache",
    "pmid": 251678724,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "mem.slabinfo.slabs.pages_per_slab",
    "text-oneline": "number of pages in each slab",
    "text-help": "number of pages in each slab",
    "pmid": 251678725,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "mem.slabinfo.slabs.objects_per_slab",
    "text-oneline": "number of objects in each slab",
    "text-help": "number of objects in each slab",
    "pmid": 251678726,
    "indom": 251658252,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "mem.slabinfo.slabs.total_size",
    "text-oneline": "total number of bytes allocated for active objects in each slab",
    "text-help": "total number of bytes allocated for active objects in each slab",
    "pmid": 251678727,
    "indom": 251658252,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.free",
    "text-oneline": "free space in each zone for each NUMA node",
    "text-help": "free space in each zone for each NUMA node",
    "pmid": 251727872,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.min",
    "text-oneline": "min space in each zone for each NUMA node",
    "text-help": "min space in each zone for each NUMA node",
    "pmid": 251727873,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.low",
    "text-oneline": "low space in each zone for each NUMA node",
    "text-help": "low space in each zone for each NUMA node",
    "pmid": 251727874,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.high",
    "text-oneline": "high space in each zone for each NUMA node",
    "text-help": "high space in each zone for each NUMA node",
    "pmid": 251727875,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.scanned",
    "text-oneline": "scanned space in each zone for each NUMA node",
    "text-help": "scanned space in each zone for each NUMA node",
    "pmid": 251727876,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.spanned",
    "text-oneline": "spanned space in each zone for each NUMA node",
    "text-help": "spanned space in each zone for each NUMA node",
    "pmid": 251727877,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.present",
    "text-oneline": "present space in each zone for each NUMA node",
    "text-help": "present space in each zone for each NUMA node",
    "pmid": 251727878,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.managed",
    "text-oneline": "managed space in each zone for each NUMA node",
    "text-help": "managed space in each zone for each NUMA node",
    "pmid": 251727879,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_free_pages",
    "text-oneline": "number of free pages in each zone for each NUMA node.",
    "text-help": "number of free pages in each zone for each NUMA node.",
    "pmid": 251727880,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_alloc_batch",
    "text-oneline": "number of pages allocated to other zones due to insufficient memory",
    "text-help": "Number of pages allocated to other zones due to insufficient memory, for\neach zone for each NUMA node.",
    "pmid": 251727881,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_inactive_anon",
    "text-oneline": "number of inactive anonymous memory pages in each zone for each NUMA node",
    "text-help": "number of inactive anonymous memory pages in each zone for each NUMA node",
    "pmid": 251727882,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_active_anon",
    "text-oneline": "number of active anonymous memory pages in each zone for each NUMA node",
    "text-help": "number of active anonymous memory pages in each zone for each NUMA node",
    "pmid": 251727883,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_inactive_file",
    "text-oneline": "number of inactive file memory pages in each zone for each NUMA node",
    "text-help": "number of inactive file memory pages in each zone for each NUMA node",
    "pmid": 251727884,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_active_file",
    "text-oneline": "number of active file memory memory pages in each zone for each NUMA node",
    "text-help": "number of active file memory memory pages in each zone for each NUMA node",
    "pmid": 251727885,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_unevictable",
    "text-oneline": "number of unevictable pages in each zone for each NUMA node",
    "text-help": "number of unevictable pages in each zone for each NUMA node",
    "pmid": 251727886,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_mlock",
    "text-oneline": "number of pages under mlock in each zone for each NUMA node",
    "text-help": "number of pages under mlock in each zone for each NUMA node",
    "pmid": 251727887,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_anon_pages",
    "text-oneline": "number of anonymous mapped pagecache pages in each zone for each NUMA node",
    "text-help": "number of anonymous mapped pagecache pages in each zone for each NUMA node",
    "pmid": 251727888,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_mapped",
    "text-oneline": "number of mapped pagecache pages in each zone for each NUMA node",
    "text-help": "number of mapped pagecache pages in each zone for each NUMA node",
    "pmid": 251727889,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_file_pages",
    "text-oneline": "number of file pagecache pages in each zone for each NUMA node",
    "text-help": "number of file pagecache pages in each zone for each NUMA node",
    "pmid": 251727890,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_dirty",
    "text-oneline": "number of pages dirty state in each zone for each NUMA node",
    "text-help": "number of pages dirty state in each zone for each NUMA node",
    "pmid": 251727891,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_writeback",
    "text-oneline": "number of pages writeback state in each zone for each NUMA node",
    "text-help": "number of pages writeback state in each zone for each NUMA node",
    "pmid": 251727892,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_slab_reclaimable",
    "text-oneline": "number of reclaimable slab pages in each zone for each NUMA node",
    "text-help": "number of reclaimable slab pages in each zone for each NUMA node",
    "pmid": 251727893,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_slab_unreclaimable",
    "text-oneline": "number of unreclaimable slab pages in each zone for each NUMA node",
    "text-help": "number of unreclaimable slab pages in each zone for each NUMA node",
    "pmid": 251727894,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_page_table_pages",
    "text-oneline": "number of page table pages in each zone for each NUMA node",
    "text-help": "number of page table pages in each zone for each NUMA node",
    "pmid": 251727895,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_kernel_stack",
    "text-oneline": "number of pages of kernel stack in each zone for each NUMA node",
    "text-help": "number of pages of kernel stack in each zone for each NUMA node",
    "pmid": 251727896,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_unstable",
    "text-oneline": "number of pages unstable state in each zone for each NUMA node",
    "text-help": "number of pages unstable state in each zone for each NUMA node",
    "pmid": 251727897,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_bounce",
    "text-oneline": "number of bounce buffer pages in each zone for each NUMA node",
    "text-help": "number of bounce buffer pages in each zone for each NUMA node",
    "pmid": 251727898,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_vmscan_write",
    "text-oneline": "pages written from the LRU by the VM scanner",
    "text-help": "Count of pages written from the LRU by the VM scanner in each zone\nfor each NUMA node.The VM is supposed to minimise the number of\npages which get written from the LRU (for IO scheduling efficiency,\nand for high reclaim-success rates).",
    "pmid": 251727899,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_vmscan_immediate_reclaim",
    "text-oneline": "prioritise for reclaim when writeback ends in each zone for each NUMA node",
    "text-help": "prioritise for reclaim when writeback ends in each zone for each NUMA node",
    "pmid": 251727900,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_writeback_temp",
    "text-oneline": "number of temporary writeback pages in each zone for each NUMA node",
    "text-help": "number of temporary writeback pages in each zone for each NUMA node",
    "pmid": 251727901,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_isolated_anon",
    "text-oneline": "number of isolated anonymous memory pages in each zone for each NUMA node",
    "text-help": "number of isolated anonymous memory pages in each zone for each NUMA node",
    "pmid": 251727902,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_isolated_file",
    "text-oneline": "number of isolated file memory pages in each zone for each NUMA node",
    "text-help": "number of isolated file memory pages in each zone for each NUMA node",
    "pmid": 251727903,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_shmem",
    "text-oneline": "number of shared memory pages in each zone for each NUMA node",
    "text-help": "number of shared memory pages in each zone for each NUMA node",
    "pmid": 251727904,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_dirtied",
    "text-oneline": "count of pages entering dirty state in each zone for each NUMA node",
    "text-help": "count of pages entering dirty state in each zone for each NUMA node",
    "pmid": 251727905,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_written",
    "text-oneline": "count of pages written out in each zone for each NUMA node",
    "text-help": "count of pages written out in each zone for each NUMA node",
    "pmid": 251727906,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_hit",
    "text-oneline": "successful allocations from preferred NUMA zone",
    "text-help": "Count of successful allocations from preferred NUMA zone in each zone\nfor each NUMA node.",
    "pmid": 251727907,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_miss",
    "text-oneline": "unsuccessful allocations from preferred NUMA zone",
    "text-help": "Count of unsuccessful allocations from preferred NUMA zone in each zone\nfor each NUMA node.",
    "pmid": 251727908,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_foreign",
    "text-oneline": "foreign NUMA zone allocations",
    "text-help": "Count of foreign NUMA zone allocations in each zone for each NUMA node.",
    "pmid": 251727909,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_interleave",
    "text-oneline": "count of interleaved NUMA allocations in each zone for each NUMA node",
    "text-help": "count of interleaved NUMA allocations in each zone for each NUMA node",
    "pmid": 251727910,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_local",
    "text-oneline": "successful allocations from local NUMA zone",
    "text-help": "Count of successful allocations from local NUMA zone in each zone for\neach NUMA node.",
    "pmid": 251727911,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.numa_other",
    "text-oneline": "unsuccessful allocations from local NUMA zone",
    "text-help": "Count of unsuccessful allocations from local NUMA zone in each zone for\neach NUMA node.",
    "pmid": 251727912,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.workingset_refault",
    "text-oneline": "count of refaults of previously evicted pages in each zone for each NUMA node",
    "text-help": "count of refaults of previously evicted pages in each zone for each NUMA node",
    "pmid": 251727913,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.workingset_activate",
    "text-oneline": "count of page activations to form the working set in each zone for each NUMA node",
    "text-help": "count of page activations to form the working set in each zone for each NUMA node",
    "pmid": 251727914,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.workingset_nodereclaim",
    "text-oneline": "count of NUMA node working set page reclaims in each zone for each NUMA node",
    "text-help": "count of NUMA node working set page reclaims in each zone for each NUMA node",
    "pmid": 251727915,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_anon_transparent_hugepages",
    "text-oneline": "number of anonymous transparent huge pages in each zone for each NUMA node",
    "text-help": "number of anonymous transparent huge pages in each zone for each NUMA node",
    "pmid": 251727916,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.nr_free_cma",
    "text-oneline": "count of free Contiguous Memory Allocator pages in each zone for each NUMA node.",
    "text-help": "count of free Contiguous Memory Allocator pages in each zone for each NUMA node.",
    "pmid": 251727917,
    "indom": 251658272,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.zoneinfo.protection",
    "text-oneline": "protection space in each zone for each NUMA node",
    "text-help": "protection space in each zone for each NUMA node",
    "pmid": 251729920,
    "indom": 251658273,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "mem.ksm.full_scans",
    "text-oneline": "Number of times that KSM has scanned for duplicated content",
    "text-help": "Number of times that KSM has scanned for duplicated content",
    "pmid": 251728896,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.ksm.merge_across_nodes",
    "text-oneline": "Kernel allows merging across NUMA nodes",
    "text-help": "Kernel allows merging across NUMA nodes",
    "pmid": 251728897,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.pages_shared",
    "text-oneline": "The number of nodes in the stable tree",
    "text-help": "The number of nodes in the stable tree",
    "pmid": 251728898,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.pages_sharing",
    "text-oneline": "The number of virtual pages that are sharing a single page",
    "text-help": "The number of virtual pages that are sharing a single page",
    "pmid": 251728899,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.pages_to_scan",
    "text-oneline": "Number of pages to scan at a time",
    "text-help": "Number of pages to scan at a time",
    "pmid": 251728900,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.pages_unshared",
    "text-oneline": "The number of nodes in the unstable tree",
    "text-help": "The number of nodes in the unstable tree",
    "pmid": 251728901,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "mem.ksm.pages_volatile",
    "text-oneline": "Number of pages that are candidate to be shared",
    "text-help": "Number of pages that are candidate to be shared",
    "pmid": 251728902,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.run_state",
    "text-oneline": "Whether the KSM daemon has run and/or is running",
    "text-help": "Whether the KSM daemon has run and/or is running",
    "pmid": 251728903,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "mem.ksm.sleep_time",
    "text-oneline": "Time ksmd should sleep between batches",
    "text-help": "Time ksmd should sleep between batches",
    "pmid": 251728904,
    "sem": "instant",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "swap.pagesin",
    "text-oneline": "pages read from swap devices due to demand for physical memory",
    "text-help": "pages read from swap devices due to demand for physical memory",
    "pmid": 251658248,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "swap.pagesout",
    "text-oneline": "pages written to swap devices due to demand for physical memory",
    "text-help": "pages written to swap devices due to demand for physical memory",
    "pmid": 251658249,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "swap.in",
    "text-oneline": "number of swap in operations",
    "text-help": "number of swap in operations",
    "pmid": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "swap.out",
    "text-oneline": "number of swap out operations",
    "text-help": "number of swap out operations",
    "pmid": 251658251,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "swap.free",
    "text-oneline": "swap free metric from /proc/meminfo",
    "text-help": "swap free metric from /proc/meminfo",
    "pmid": 251659272,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "swap.length",
    "text-oneline": "total swap available metric from /proc/meminfo",
    "text-help": "total swap available metric from /proc/meminfo",
    "pmid": 251659270,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "swap.used",
    "text-oneline": "swap used metric from /proc/meminfo",
    "text-help": "swap used metric from /proc/meminfo",
    "pmid": 251659271,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "network.interface.collisions",
    "text-oneline": "network send collisions from /proc/net/dev per network interface",
    "text-help": "colls column on the \"Transmit\" side of /proc/net/dev\n(stats->collisions counter in rtnl_link_stats64).\nCounter only valid for outgoing packets.",
    "pmid": 251661325,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.mtu",
    "text-oneline": "maximum transmission unit on network interface",
    "text-help": "maximum transmission unit on network interface",
    "pmid": 251661333,
    "indom": 251658243,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "network.interface.speed",
    "text-oneline": "interface speed in megabytes per second",
    "text-help": "The linespeed on the network interface, as reported by the kernel,\nscaled from Megabits/second to Megabytes/second.\nSee also network.interface.baudrate for the bytes/second value.",
    "pmid": 251661334,
    "indom": 251658243,
    "sem": "discrete",
    "units": "Mbyte / sec",
    "type": "FLOAT"
  },
  {
    "name": "network.interface.baudrate",
    "text-oneline": "interface speed in bytes per second",
    "text-help": "The linespeed on the network interface, as reported by the kernel,\nscaled up from Megabits/second to bits/second and divided by 8 to convert\nto bytes/second.\nSee also network.interface.speed for the Megabytes/second value.",
    "pmid": 251661335,
    "indom": 251658243,
    "sem": "discrete",
    "units": "byte / sec",
    "type": "U64"
  },
  {
    "name": "network.interface.duplex",
    "text-oneline": "value one for half or two for full duplex interface",
    "text-help": "value one for half or two for full duplex interface",
    "pmid": 251661336,
    "indom": 251658243,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "network.interface.up",
    "text-oneline": "boolean for whether interface is currently up or down",
    "text-help": "boolean for whether interface is currently up or down",
    "pmid": 251661337,
    "indom": 251658243,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "network.interface.running",
    "text-oneline": "boolean for whether interface has resources allocated",
    "text-help": "boolean for whether interface has resources allocated",
    "pmid": 251661338,
    "indom": 251658243,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "network.interface.wireless",
    "text-oneline": "boolean for whether interface is wireless",
    "text-help": "boolean for whether interface is wireless",
    "pmid": 251661340,
    "indom": 251658243,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "network.interface.type",
    "text-oneline": "sysfs interface name assignment type value",
    "text-help": "sysfs interface name assignment type value",
    "pmid": 251661341,
    "indom": 251658243,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "network.interface.inet_addr",
    "text-oneline": "string INET interface address (ifconfig style)",
    "text-help": "string INET interface address (ifconfig style)",
    "pmid": 251692032,
    "indom": 251658257,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "network.interface.ipv6_addr",
    "text-oneline": "string IPv6 interface address (ifconfig style)",
    "text-help": "string IPv6 interface address (ifconfig style)",
    "pmid": 251692033,
    "indom": 251658257,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "network.interface.ipv6_scope",
    "text-oneline": "string IPv6 interface scope (ifconfig style)",
    "text-help": "string IPv6 interface scope (ifconfig style)",
    "pmid": 251692034,
    "indom": 251658257,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "network.interface.hw_addr",
    "text-oneline": "hardware address (from sysfs)",
    "text-help": "hardware address (from sysfs)",
    "pmid": 251692035,
    "indom": 251658257,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "network.interface.in.bytes",
    "text-oneline": "network recv read bytes from /proc/net/dev per network interface",
    "text-help": "bytes column on the \"Receive\" side of /proc/net/dev (stats->rx_bytes counter in\nrtnl_link_stats64)",
    "pmid": 251661312,
    "indom": 251658243,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "network.interface.in.packets",
    "text-oneline": "network recv read packets from /proc/net/dev per network interface",
    "text-help": "packets column on the \"Receive\" side of /proc/net/dev\n(stats->rx_packets counter in rtnl_link_stats64)",
    "pmid": 251661313,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.errors",
    "text-oneline": "network recv read errors from /proc/net/dev per network interface",
    "text-help": "errors column on the \"Receive\" side of /proc/net/dev\n(stats->rx_errors counter in rtnl_link_stats64)",
    "pmid": 251661314,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.drops",
    "text-oneline": "network recv read drops from /proc/net/dev per network interface",
    "text-help": "drop column on the \"Receive\" side of /proc/net/dev\n(stats->{rx_dropped + rx_missed_errors} counters in rtnl_link_stats64)\nrx_dropped are the dropped packets due to no space in linux buffers and rx_missed\nare due to the receiver NIC missing a packet.\nNot all NICS use the rx_missed_errors counter.",
    "pmid": 251661315,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.fifo",
    "text-oneline": "network recv fifo overrun errors from /proc/net/dev per network interface",
    "text-help": "fifo column on the \"Receive\" side of /proc/net/dev\n(stats->rx_fifo_errors counter in rtnl_link_stats64)",
    "pmid": 251661316,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.frame",
    "text-oneline": "network recv frames errors from /proc/net/dev per network interface",
    "text-help": "frame column on the \"Receive\" side of /proc/net/dev\n(stats->{rx_length_errors + rx_over_errors + rx_crc_errors + rx_frame_errors}\ncounters in rtnl_link_stats64)",
    "pmid": 251661317,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.compressed",
    "text-oneline": "network recv compressed from /proc/net/dev per network interface",
    "text-help": "compressed column on the \"Receive\" side of /proc/net/dev\n(stats->rx_compressed counter in rtnl_link_stats64).\nAlmost exclusively used for CSLIP or HDLC devices",
    "pmid": 251661318,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.in.mcasts",
    "text-oneline": "network recv multicast packets from /proc/net/dev per network interface",
    "text-help": "multicast column on the \"Receive\" side of /proc/net/dev\n(stats->multicast counter in rtnl_link_stats64)",
    "pmid": 251661319,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.bytes",
    "text-oneline": "network send bytes from /proc/net/dev per network interface",
    "text-help": "bytes column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_bytes counter in rtnl_link_stats64)",
    "pmid": 251661320,
    "indom": 251658243,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "network.interface.out.packets",
    "text-oneline": "network send packets from /proc/net/dev per network interface",
    "text-help": "packets column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_packets counter in rtnl_link_stats64)",
    "pmid": 251661321,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.errors",
    "text-oneline": "network send errors from /proc/net/dev per network interface",
    "text-help": "errors column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_errors counter in rtnl_link_stats64)",
    "pmid": 251661322,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.drops",
    "text-oneline": "network send drops from /proc/net/dev per network interface",
    "text-help": "drop column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_dropped counter in rtnl_link_stats64)",
    "pmid": 251661323,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.fifo",
    "text-oneline": "network send fifos from /proc/net/dev per network interface",
    "text-help": "fifo column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_fifo_errors counter in rtnl_link_stats64)",
    "pmid": 251661324,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.carrier",
    "text-oneline": "network send carrier from /proc/net/dev per network interface",
    "text-help": "carrier column on the \"Transmit\" side of /proc/net/dev\n(stats->{tx_carrier_errors + tx_aborted_errors + tx_window_errors +\ntx_heartbeat_errors} counters in rtnl_link_stats64).",
    "pmid": 251661326,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.out.compressed",
    "text-oneline": "network send compressed from /proc/net/dev per network interface",
    "text-help": "compressed column on the \"Transmit\" side of /proc/net/dev\n(stats->tx_compressed counter in rtnl_link_stats64).\nAlmost exclusively used for CSLIP or HDLC devices",
    "pmid": 251661327,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.total.bytes",
    "text-oneline": "network total (in+out) bytes from /proc/net/dev per network interface",
    "text-help": "network total (in+out) bytes from /proc/net/dev per network interface",
    "pmid": 251661328,
    "indom": 251658243,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "network.interface.total.packets",
    "text-oneline": "network total (in+out) packets from /proc/net/dev per network interface",
    "text-help": "network total (in+out) packets from /proc/net/dev per network interface",
    "pmid": 251661329,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.total.errors",
    "text-oneline": "network total (in+out) errors from /proc/net/dev per network interface",
    "text-help": "network total (in+out) errors from /proc/net/dev per network interface",
    "pmid": 251661330,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.total.drops",
    "text-oneline": "network total (in+out) drops from /proc/net/dev per network interface",
    "text-help": "network total (in+out) drops from /proc/net/dev per network interface",
    "pmid": 251661331,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.interface.total.mcasts",
    "text-oneline": "network total (in) mcasts from /proc/net/dev per network interface",
    "text-help": "Linux does not account for outgoing mcast packets per device, so this counter\nis identical to the incoming mcast metric.",
    "pmid": 251661332,
    "indom": 251658243,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.sockstat.total",
    "text-oneline": "total number of sockets used by the system.",
    "text-help": "total number of sockets used by the system.",
    "pmid": 251669513,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp.inuse",
    "text-oneline": "instantaneous number of tcp sockets currently in use",
    "text-help": "instantaneous number of tcp sockets currently in use",
    "pmid": 251669504,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp.orphan",
    "text-oneline": "instantaneous number of orphan sockets",
    "text-help": "instantaneous number of orphan sockets",
    "pmid": 251669514,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp.tw",
    "text-oneline": "instantaneous number of sockets wating close",
    "text-help": "instantaneous number of sockets wating close",
    "pmid": 251669515,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp.alloc",
    "text-oneline": "instantaneous number of allocated sockets",
    "text-help": "instantaneous number of allocated sockets",
    "pmid": 251669516,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp.mem",
    "text-oneline": "instantaneous number of used memory for tcp ",
    "text-help": "instantaneous number of used memory for tcp ",
    "pmid": 251669517,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.udp.inuse",
    "text-oneline": "instantaneous number of udp sockets currently in use",
    "text-help": "instantaneous number of udp sockets currently in use",
    "pmid": 251669507,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.udp.mem",
    "text-oneline": "nstantaneous number of used memory for udp",
    "text-help": "nstantaneous number of used memory for udp",
    "pmid": 251669518,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.udplite.inuse",
    "text-oneline": "instantaneous number of udplite sockets currently in use",
    "text-help": "instantaneous number of udplite sockets currently in use",
    "pmid": 251669512,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.raw.inuse",
    "text-oneline": "instantaneous number of raw sockets currently in use",
    "text-help": "instantaneous number of raw sockets currently in use",
    "pmid": 251669510,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.frag.inuse",
    "text-oneline": "instantaneous number of frag sockets currently in use",
    "text-help": "instantaneous number of frag sockets currently in use",
    "pmid": 251669519,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.frag.memory",
    "text-oneline": "nstantaneous number of used memory for frag",
    "text-help": "nstantaneous number of used memory for frag",
    "pmid": 251669520,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.tcp6.inuse",
    "text-oneline": "instantaneous number of tcp6 sockets currently in use",
    "text-help": "instantaneous number of tcp6 sockets currently in use",
    "pmid": 251732992,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.udp6.inuse",
    "text-oneline": "instantaneous number of udp6 sockets currently in use",
    "text-help": "instantaneous number of udp6 sockets currently in use",
    "pmid": 251732993,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.udplite6.inuse",
    "text-oneline": "instantaneous number of udplite6 sockets currently in use",
    "text-help": "instantaneous number of udplite6 sockets currently in use",
    "pmid": 251732994,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.raw6.inuse",
    "text-oneline": "instantaneous number of raw6 sockets currently in use",
    "text-help": "instantaneous number of raw6 sockets currently in use",
    "pmid": 251732995,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.frag6.inuse",
    "text-oneline": "instantaneous number of frag6 sockets currently in use",
    "text-help": "instantaneous number of frag6 sockets currently in use",
    "pmid": 251732996,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.sockstat.frag6.memory",
    "text-oneline": "instantaneous number of used memory for frag6",
    "text-help": "instantaneous number of used memory for frag6",
    "pmid": 251732997,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "network.ip.forwarding",
    "text-oneline": "count of ip forwarding",
    "text-help": "count of ip forwarding",
    "pmid": 251672576,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.defaultttl",
    "text-oneline": "count of ip defaultttl",
    "text-help": "count of ip defaultttl",
    "pmid": 251672577,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inreceives",
    "text-oneline": "count of ip inreceives",
    "text-help": "count of ip inreceives",
    "pmid": 251672578,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inhdrerrors",
    "text-oneline": "count of ip inhdrerrors",
    "text-help": "count of ip inhdrerrors",
    "pmid": 251672579,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inaddrerrors",
    "text-oneline": "count of ip inaddrerrors",
    "text-help": "count of ip inaddrerrors",
    "pmid": 251672580,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.forwdatagrams",
    "text-oneline": "count of ip forwdatagrams",
    "text-help": "count of ip forwdatagrams",
    "pmid": 251672581,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inunknownprotos",
    "text-oneline": "count of ip inunknownprotos",
    "text-help": "count of ip inunknownprotos",
    "pmid": 251672582,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.indiscards",
    "text-oneline": "count of ip indiscards",
    "text-help": "count of ip indiscards",
    "pmid": 251672583,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.indelivers",
    "text-oneline": "count of ip indelivers",
    "text-help": "count of ip indelivers",
    "pmid": 251672584,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outrequests",
    "text-oneline": "count of ip outrequests",
    "text-help": "count of ip outrequests",
    "pmid": 251672585,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outdiscards",
    "text-oneline": "count of ip outdiscards",
    "text-help": "count of ip outdiscards",
    "pmid": 251672586,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outnoroutes",
    "text-oneline": "count of ip outnoroutes",
    "text-help": "count of ip outnoroutes",
    "pmid": 251672587,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.reasmtimeout",
    "text-oneline": "count of ip reasmtimeout",
    "text-help": "count of ip reasmtimeout",
    "pmid": 251672588,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.reasmreqds",
    "text-oneline": "count of ip reasmreqds",
    "text-help": "count of ip reasmreqds",
    "pmid": 251672589,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.reasmoks",
    "text-oneline": "count of ip reasmoks",
    "text-help": "count of ip reasmoks",
    "pmid": 251672590,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.reasmfails",
    "text-oneline": "count of ip reasmfails",
    "text-help": "count of ip reasmfails",
    "pmid": 251672591,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.fragoks",
    "text-oneline": "count of ip fragoks",
    "text-help": "count of ip fragoks",
    "pmid": 251672592,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.fragfails",
    "text-oneline": "count of ip fragfails",
    "text-help": "count of ip fragfails",
    "pmid": 251672593,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.fragcreates",
    "text-oneline": "count of ip fragcreates",
    "text-help": "count of ip fragcreates",
    "pmid": 251672594,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.innoroutes",
    "text-oneline": "Number of IP datagrams discarded due to no routes in forwarding path",
    "text-help": "Number of IP datagrams discarded due to no routes in forwarding path",
    "pmid": 251712512,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.intruncatedpkts",
    "text-oneline": "Number of IP datagrams discarded due to frame not carrying enough data",
    "text-help": "Number of IP datagrams discarded due to frame not carrying enough data",
    "pmid": 251712513,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inmcastpkts",
    "text-oneline": "Number of received IP multicast datagrams",
    "text-help": "Number of received IP multicast datagrams",
    "pmid": 251712514,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outmcastpkts",
    "text-oneline": "Number of sent IP multicast datagrams",
    "text-help": "Number of sent IP multicast datagrams",
    "pmid": 251712515,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inbcastpkts",
    "text-oneline": "Number of received IP broadcast datagrams",
    "text-help": "Number of received IP broadcast datagrams",
    "pmid": 251712516,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outbcastpkts",
    "text-oneline": "Number of sent IP bradcast datagrams",
    "text-help": "Number of sent IP bradcast datagrams",
    "pmid": 251712517,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inoctets",
    "text-oneline": "Number of received octets",
    "text-help": "Number of received octets",
    "pmid": 251712518,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outoctets",
    "text-oneline": "Number of sent octets",
    "text-help": "Number of sent octets",
    "pmid": 251712519,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inmcastoctets",
    "text-oneline": "Number of received IP multicast octets",
    "text-help": "Number of received IP multicast octets",
    "pmid": 251712520,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outmcastoctets",
    "text-oneline": "Number of sent IP multicast octets",
    "text-help": "Number of sent IP multicast octets",
    "pmid": 251712521,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.inbcastoctets",
    "text-oneline": "Number of received IP broadcast octets",
    "text-help": "Number of received IP broadcast octets",
    "pmid": 251712522,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.outbcastoctets",
    "text-oneline": "Number of sent IP broadcast octets",
    "text-help": "Number of sent IP broadcast octets",
    "pmid": 251712523,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.csumerrors",
    "text-oneline": "Number of IP datagrams with checksum errors",
    "text-help": "Number of IP datagrams with checksum errors",
    "pmid": 251712524,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.noectpkts",
    "text-oneline": "Number of packets received with NOECT",
    "text-help": "Number of packets received with NOECT",
    "pmid": 251712525,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.ect1pkts",
    "text-oneline": "Number of packets received with ECT(1)",
    "text-help": "Number of packets received with ECT(1)",
    "pmid": 251712526,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.ect0pkts",
    "text-oneline": "Number of packets received with ECT(0)",
    "text-help": "Number of packets received with ECT(0)",
    "pmid": 251712527,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip.cepkts",
    "text-oneline": "Number of packets received with Congestion Experimented",
    "text-help": "Number of packets received with Congestion Experimented",
    "pmid": 251712528,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inmsgs",
    "text-oneline": "count of icmp inmsgs",
    "text-help": "count of icmp inmsgs",
    "pmid": 251672596,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inerrors",
    "text-oneline": "count of icmp inerrors",
    "text-help": "count of icmp inerrors",
    "pmid": 251672597,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.indestunreachs",
    "text-oneline": "count of icmp indestunreachs",
    "text-help": "count of icmp indestunreachs",
    "pmid": 251672598,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.intimeexcds",
    "text-oneline": "count of icmp intimeexcds",
    "text-help": "count of icmp intimeexcds",
    "pmid": 251672599,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inparmprobs",
    "text-oneline": "count of icmp inparmprobs",
    "text-help": "count of icmp inparmprobs",
    "pmid": 251672600,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.insrcquenchs",
    "text-oneline": "count of icmp insrcquenchs",
    "text-help": "count of icmp insrcquenchs",
    "pmid": 251672601,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inredirects",
    "text-oneline": "count of icmp inredirects",
    "text-help": "count of icmp inredirects",
    "pmid": 251672602,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inechos",
    "text-oneline": "count of icmp inechos",
    "text-help": "count of icmp inechos",
    "pmid": 251672603,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inechoreps",
    "text-oneline": "count of icmp inechoreps",
    "text-help": "count of icmp inechoreps",
    "pmid": 251672604,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.intimestamps",
    "text-oneline": "count of icmp intimestamps",
    "text-help": "count of icmp intimestamps",
    "pmid": 251672605,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.intimestampreps",
    "text-oneline": "count of icmp intimestampreps",
    "text-help": "count of icmp intimestampreps",
    "pmid": 251672606,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inaddrmasks",
    "text-oneline": "count of icmp inaddrmasks",
    "text-help": "count of icmp inaddrmasks",
    "pmid": 251672607,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.inaddrmaskreps",
    "text-oneline": "count of icmp inaddrmaskreps",
    "text-help": "count of icmp inaddrmaskreps",
    "pmid": 251672608,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outmsgs",
    "text-oneline": "count of icmp outmsgs",
    "text-help": "count of icmp outmsgs",
    "pmid": 251672609,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outerrors",
    "text-oneline": "count of icmp outerrors",
    "text-help": "count of icmp outerrors",
    "pmid": 251672610,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outdestunreachs",
    "text-oneline": "count of icmp outdestunreachs",
    "text-help": "count of icmp outdestunreachs",
    "pmid": 251672611,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outtimeexcds",
    "text-oneline": "count of icmp outtimeexcds",
    "text-help": "count of icmp outtimeexcds",
    "pmid": 251672612,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outparmprobs",
    "text-oneline": "count of icmp outparmprobs",
    "text-help": "count of icmp outparmprobs",
    "pmid": 251672613,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outsrcquenchs",
    "text-oneline": "count of icmp outsrcquenchs",
    "text-help": "count of icmp outsrcquenchs",
    "pmid": 251672614,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outredirects",
    "text-oneline": "count of icmp outredirects",
    "text-help": "count of icmp outredirects",
    "pmid": 251672615,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outechos",
    "text-oneline": "count of icmp outechos",
    "text-help": "count of icmp outechos",
    "pmid": 251672616,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outechoreps",
    "text-oneline": "count of icmp outechoreps",
    "text-help": "count of icmp outechoreps",
    "pmid": 251672617,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outtimestamps",
    "text-oneline": "count of icmp outtimestamps",
    "text-help": "count of icmp outtimestamps",
    "pmid": 251672618,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outtimestampreps",
    "text-oneline": "count of icmp outtimestampreps",
    "text-help": "count of icmp outtimestampreps",
    "pmid": 251672619,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outaddrmasks",
    "text-oneline": "count of icmp outaddrmasks",
    "text-help": "count of icmp outaddrmasks",
    "pmid": 251672620,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.outaddrmaskreps",
    "text-oneline": "count of icmp outaddrmaskreps",
    "text-help": "count of icmp outaddrmaskreps",
    "pmid": 251672621,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp.incsumerrors",
    "text-oneline": "count of icmp in checksum errors",
    "text-help": "count of icmp in checksum errors",
    "pmid": 251672622,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmpmsg.intype",
    "text-oneline": "count of icmp message types recvd",
    "text-help": "count of icmp message types recvd",
    "pmid": 251672664,
    "indom": 251658263,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmpmsg.outtype",
    "text-oneline": "count of icmp message types sent",
    "text-help": "count of icmp message types sent",
    "pmid": 251672665,
    "indom": 251658263,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.rtoalgorithm",
    "text-oneline": "the restransmission timeout algorithm in use",
    "text-help": "the restransmission timeout algorithm in use",
    "pmid": 251672626,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "network.tcp.rtomin",
    "text-oneline": "minimum retransmission timeout",
    "text-help": "minimum retransmission timeout",
    "pmid": 251672627,
    "sem": "instant",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "network.tcp.rtomax",
    "text-oneline": "maximum retransmission timeout",
    "text-help": "maximum retransmission timeout",
    "pmid": 251672628,
    "sem": "instant",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "network.tcp.maxconn",
    "text-oneline": "limit on tcp connections",
    "text-help": "limit on tcp connections",
    "pmid": 251672629,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "network.tcp.activeopens",
    "text-oneline": "count of tcp activeopens",
    "text-help": "count of tcp activeopens",
    "pmid": 251672630,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.passiveopens",
    "text-oneline": "count of tcp passiveopens",
    "text-help": "count of tcp passiveopens",
    "pmid": 251672631,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.attemptfails",
    "text-oneline": "count of tcp attemptfails",
    "text-help": "count of tcp attemptfails",
    "pmid": 251672632,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.estabresets",
    "text-oneline": "count of tcp estabresets",
    "text-help": "count of tcp estabresets",
    "pmid": 251672633,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.currestab",
    "text-oneline": "current established tcp connections",
    "text-help": "current established tcp connections",
    "pmid": 251672634,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "network.tcp.insegs",
    "text-oneline": "count of tcp segments received",
    "text-help": "count of tcp segments received",
    "pmid": 251672635,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.outsegs",
    "text-oneline": "count of tcp segments sent",
    "text-help": "count of tcp segments sent",
    "pmid": 251672636,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.retranssegs",
    "text-oneline": "count of tcp segments retransmitted",
    "text-help": "count of tcp segments retransmitted",
    "pmid": 251672637,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.inerrs",
    "text-oneline": "count of tcp segments received in error",
    "text-help": "count of tcp segments received in error",
    "pmid": 251672638,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.outrsts",
    "text-oneline": "count of tcp segments sent with RST flag",
    "text-help": "count of tcp segments sent with RST flag",
    "pmid": 251672639,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.incsumerrors",
    "text-oneline": "count of tcp segments received with checksum errors",
    "text-help": "count of tcp segments received with checksum errors",
    "pmid": 251672640,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.syncookiessent",
    "text-oneline": "Number of sent SYN cookies",
    "text-help": "Number of sent SYN cookies",
    "pmid": 251712529,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.syncookiesrecv",
    "text-oneline": "Number of received SYN cookies",
    "text-help": "Number of received SYN cookies",
    "pmid": 251712530,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.syncookiesfailed",
    "text-oneline": "Number of failed SYN cookies",
    "text-help": "Number of failed SYN cookies",
    "pmid": 251712531,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.embryonicrsts",
    "text-oneline": "Number of resets received for embryonic SYN_RECV sockets",
    "text-help": "Number of resets received for embryonic SYN_RECV sockets",
    "pmid": 251712532,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.prunecalled",
    "text-oneline": "Number of packets pruned from receive queue because of socket buffer overrun",
    "text-help": "Number of packets pruned from receive queue because of socket buffer overrun",
    "pmid": 251712533,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.rcvpruned",
    "text-oneline": "Number of packets pruned from receive queue",
    "text-help": "Number of packets pruned from receive queue",
    "pmid": 251712534,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.ofopruned",
    "text-oneline": "Number of packets dropped from out-of-order queue because of socket buffer overrun",
    "text-help": "Number of packets dropped from out-of-order queue because of socket buffer overrun",
    "pmid": 251712535,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.outofwindowicmps",
    "text-oneline": "Number of dropped out of window ICMPs",
    "text-help": "Number of dropped out of window ICMPs",
    "pmid": 251712536,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lockdroppedicmps",
    "text-oneline": "Number of dropped ICMP because socket was locked",
    "text-help": "Number of dropped ICMP because socket was locked",
    "pmid": 251712537,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.arpfilter",
    "text-oneline": "Number of arp packets filtered",
    "text-help": "Number of arp packets filtered",
    "pmid": 251712538,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.timewaited",
    "text-oneline": "Number of TCP sockets finished time wait in fast timer",
    "text-help": "Number of TCP sockets finished time wait in fast timer",
    "pmid": 251712539,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.timewaitrecycled",
    "text-oneline": "Number of time wait sockets recycled by time stamp",
    "text-help": "Number of time wait sockets recycled by time stamp",
    "pmid": 251712540,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.timewaitkilled",
    "text-oneline": "Number of TCP sockets finished time wait in slow timer",
    "text-help": "Number of TCP sockets finished time wait in slow timer",
    "pmid": 251712541,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.pawspassiverejected",
    "text-oneline": "Number of passive connections rejected because of timestamp",
    "text-help": "Number of passive connections rejected because of timestamp",
    "pmid": 251712542,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.pawsactiverejected",
    "text-oneline": "Number of active connections rejected because of timestamp",
    "text-help": "Number of active connections rejected because of timestamp",
    "pmid": 251712543,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.pawsestabrejected",
    "text-oneline": "Number of packets rejects in established connections because of timestamp",
    "text-help": "Number of packets rejects in established connections because of timestamp",
    "pmid": 251712544,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.delayedacks",
    "text-oneline": "Number of delayed acks sent",
    "text-help": "Number of delayed acks sent",
    "pmid": 251712545,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.delayedacklocked",
    "text-oneline": "Number of delayed acks further delayed because of locked socket",
    "text-help": "Number of delayed acks further delayed because of locked socket",
    "pmid": 251712546,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.delayedacklost",
    "text-oneline": "Number of times quick ack mode was activated times",
    "text-help": "Number of times quick ack mode was activated times",
    "pmid": 251712547,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.listenoverflows",
    "text-oneline": "Number of times the listen queue of a socket overflowed",
    "text-help": "Number of times the listen queue of a socket overflowed",
    "pmid": 251712548,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.listendrops",
    "text-oneline": "Number of SYNs to LISTEN sockets dropped",
    "text-help": "Number of SYNs to LISTEN sockets dropped",
    "pmid": 251712549,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.prequeued",
    "text-oneline": "Number of packets directly queued to recvmsg prequeue",
    "text-help": "Number of packets directly queued to recvmsg prequeue",
    "pmid": 251712550,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.directcopyfrombacklog",
    "text-oneline": "Number of bytes directly in process context from backlog",
    "text-help": "Number of bytes directly in process context from backlog",
    "pmid": 251712551,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.directcopyfromprequeue",
    "text-oneline": "Number of bytes directly received in process context from prequeue",
    "text-help": "Number of bytes directly received in process context from prequeue",
    "pmid": 251712552,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.prequeueddropped",
    "text-oneline": "Number of packets dropped from prequeue",
    "text-help": "Number of packets dropped from prequeue",
    "pmid": 251712553,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.hphits",
    "text-oneline": "Number of packet headers predicted",
    "text-help": "Number of packet headers predicted",
    "pmid": 251712554,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.hphitstouser",
    "text-oneline": "Number of packets header predicted and directly queued to user",
    "text-help": "Number of packets header predicted and directly queued to user",
    "pmid": 251712555,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.pureacks",
    "text-oneline": "Number of acknowledgments not containing data payload received",
    "text-help": "Number of acknowledgments not containing data payload received",
    "pmid": 251712556,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.hpacks",
    "text-oneline": "Number of predicted acknowledgments",
    "text-help": "Number of predicted acknowledgments",
    "pmid": 251712557,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.renorecovery",
    "text-oneline": "Number of times recovered from packet loss due to fast retransmit",
    "text-help": "Number of times recovered from packet loss due to fast retransmit",
    "pmid": 251712558,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackrecovery",
    "text-oneline": "Number of times recovered from packet loss by selective acknowledgements",
    "text-help": "Number of times recovered from packet loss by selective acknowledgements",
    "pmid": 251712559,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackreneging",
    "text-oneline": "Number of bad SACK blocks received",
    "text-help": "Number of bad SACK blocks received",
    "pmid": 251712560,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fackreorder",
    "text-oneline": "Number of times detected reordering using FACK",
    "text-help": "Number of times detected reordering using FACK",
    "pmid": 251712561,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackreorder",
    "text-oneline": "Number of times detected reordering using SACK",
    "text-help": "Number of times detected reordering using SACK",
    "pmid": 251712562,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.renoreorder",
    "text-oneline": "Number of times detected reordering using reno fast retransmit",
    "text-help": "Number of times detected reordering using reno fast retransmit",
    "pmid": 251712563,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.tsreorder",
    "text-oneline": "Number of times detected reordering times using time stamp",
    "text-help": "Number of times detected reordering times using time stamp",
    "pmid": 251712564,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fullundo",
    "text-oneline": "Number of congestion windows fully recovered without slow start",
    "text-help": "Number of congestion windows fully recovered without slow start",
    "pmid": 251712565,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.partialundo",
    "text-oneline": "Number of congestion windows partially recovered using Hoe heuristic",
    "text-help": "Number of congestion windows partially recovered using Hoe heuristic",
    "pmid": 251712566,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackundo",
    "text-oneline": "Number of congestion windows recovered without slow start using DSACK",
    "text-help": "Number of congestion windows recovered without slow start using DSACK",
    "pmid": 251712567,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lossundo",
    "text-oneline": "Number of congestion windows recovered without slow start after partial ack",
    "text-help": "Number of congestion windows recovered without slow start after partial ack",
    "pmid": 251712568,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lostretransmit",
    "text-oneline": "Number of retransmits lost",
    "text-help": "Number of retransmits lost",
    "pmid": 251712569,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.renofailures",
    "text-oneline": "Number of timeouts after reno fast retransmit",
    "text-help": "Number of timeouts after reno fast retransmit",
    "pmid": 251712570,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackfailures",
    "text-oneline": "Number of timeouts after SACK recovery",
    "text-help": "Number of timeouts after SACK recovery",
    "pmid": 251712571,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lossfailures",
    "text-oneline": "Number of timeouts in loss state",
    "text-help": "Number of timeouts in loss state",
    "pmid": 251712572,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastretrans",
    "text-oneline": "Number of fast retransmits",
    "text-help": "Number of fast retransmits",
    "pmid": 251712573,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.forwardretrans",
    "text-oneline": "Number of forward retransmits",
    "text-help": "Number of forward retransmits",
    "pmid": 251712574,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.slowstartretrans",
    "text-oneline": "Number of retransmits in slow start",
    "text-help": "Number of retransmits in slow start",
    "pmid": 251712575,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.timeouts",
    "text-oneline": "Number of other TCP timeouts",
    "text-help": "Number of other TCP timeouts",
    "pmid": 251712576,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lossprobes",
    "text-oneline": "Number of sent TCP loss probes",
    "text-help": "Number of sent TCP loss probes",
    "pmid": 251712577,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.lossproberecovery",
    "text-oneline": "Number of TCP loss probe recoveries",
    "text-help": "Number of TCP loss probe recoveries",
    "pmid": 251712578,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.renorecoveryfail",
    "text-oneline": "Number of reno fast retransmits failed",
    "text-help": "Number of reno fast retransmits failed",
    "pmid": 251712579,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackrecoveryfail",
    "text-oneline": "Number of SACK retransmits failed",
    "text-help": "Number of SACK retransmits failed",
    "pmid": 251712580,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.schedulerfail",
    "text-oneline": "Number of times receiver scheduled too late for direct processing",
    "text-help": "Number of times receiver scheduled too late for direct processing",
    "pmid": 251712581,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.rcvcollapsed",
    "text-oneline": "Number of packets collapsed in receive queue due to low socket buffer",
    "text-help": "Number of packets collapsed in receive queue due to low socket buffer",
    "pmid": 251712582,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackoldsent",
    "text-oneline": "Number of DSACKs sent for old packets",
    "text-help": "Number of DSACKs sent for old packets",
    "pmid": 251712583,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackofosent",
    "text-oneline": "Number of DSACKs sent for out of order packets",
    "text-help": "Number of DSACKs sent for out of order packets",
    "pmid": 251712584,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackrecv",
    "text-oneline": "Number of DSACKs received",
    "text-help": "Number of DSACKs received",
    "pmid": 251712585,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackoforecv",
    "text-oneline": "Number of DSACKs for out of order packets received",
    "text-help": "Number of DSACKs for out of order packets received",
    "pmid": 251712586,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortondata",
    "text-oneline": "Number of connections reset due to unexpected data",
    "text-help": "Number of connections reset due to unexpected data",
    "pmid": 251712587,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortonclose",
    "text-oneline": "Number of connections reset due to early user close",
    "text-help": "Number of connections reset due to early user close",
    "pmid": 251712588,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortonmemory",
    "text-oneline": "Number of connections aborted due to memory pressure",
    "text-help": "Number of connections aborted due to memory pressure",
    "pmid": 251712589,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortontimeout",
    "text-oneline": "Number of connections aborted due to timeout",
    "text-help": "Number of connections aborted due to timeout",
    "pmid": 251712590,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortonlinger",
    "text-oneline": "Number of connections aborted after user close in linger timeout",
    "text-help": "Number of connections aborted after user close in linger timeout",
    "pmid": 251712591,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.abortfailed",
    "text-oneline": "Number of times unable to send RST due to no memory",
    "text-help": "Number of times unable to send RST due to no memory",
    "pmid": 251712592,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.memorypressures",
    "text-oneline": "Numer of times TCP ran low on memory",
    "text-help": "Numer of times TCP ran low on memory",
    "pmid": 251712593,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackdiscard",
    "text-oneline": "Number of SACKs discarded",
    "text-help": "Number of SACKs discarded",
    "pmid": 251712594,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackignoredold",
    "text-oneline": "Number of ignored old duplicate SACKs",
    "text-help": "Number of ignored old duplicate SACKs",
    "pmid": 251712595,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.dsackignorednoundo",
    "text-oneline": "Number of ignored duplicate SACKs with undo_marker not set",
    "text-help": "Number of ignored duplicate SACKs with undo_marker not set",
    "pmid": 251712596,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.spuriousrtos",
    "text-oneline": "Number of FRTO's successfully detected spurious RTOs",
    "text-help": "Number of FRTO's successfully detected spurious RTOs",
    "pmid": 251712597,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.md5notfound",
    "text-oneline": "Number of times MD5 hash expected but not found",
    "text-help": "Number of times MD5 hash expected but not found",
    "pmid": 251712598,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.md5unexpected",
    "text-oneline": "Number of times MD5 hash unexpected but found",
    "text-help": "Number of times MD5 hash unexpected but found",
    "pmid": 251712599,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackshifted",
    "text-oneline": "Number of SACKs shifted",
    "text-help": "Number of SACKs shifted",
    "pmid": 251712600,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackmerged",
    "text-oneline": "Number of SACKs merged",
    "text-help": "Number of SACKs merged",
    "pmid": 251712601,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.sackshiftfallback",
    "text-oneline": "Number of SACKs fallbacks",
    "text-help": "Number of SACKs fallbacks",
    "pmid": 251712602,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.backlogdrop",
    "text-oneline": "Number of frames dropped because of full backlog queue",
    "text-help": "Number of frames dropped because of full backlog queue",
    "pmid": 251712603,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.minttldrop",
    "text-oneline": "Number of frames dropped when TTL is under the minimum",
    "text-help": "Number of frames dropped when TTL is under the minimum",
    "pmid": 251712604,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.deferacceptdrop",
    "text-oneline": "Number of dropped ACK frames when socket is in SYN-RECV state",
    "text-help": "Due to SYNACK retrans count lower than defer_accept value",
    "pmid": 251712605,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.iprpfilter",
    "text-oneline": "Number of packets dropped in input path because of rp_filter settings",
    "text-help": "Number of packets dropped in input path because of rp_filter settings",
    "pmid": 251712606,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.timewaitoverflow",
    "text-oneline": "Number of occurences of time wait bucket overflow",
    "text-help": "Number of occurences of time wait bucket overflow",
    "pmid": 251712607,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.reqqfulldocookies",
    "text-oneline": "Number of times a SYNCOOKIE was replied to client",
    "text-help": "Number of times a SYNCOOKIE was replied to client",
    "pmid": 251712608,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.reqqfulldrop",
    "text-oneline": "Number of times a SYN request was dropped due to disabled syncookies",
    "text-help": "Number of times a SYN request was dropped due to disabled syncookies",
    "pmid": 251712609,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.retransfail",
    "text-oneline": "Number of failed tcp_retransmit_skb() calls",
    "text-help": "Number of failed tcp_retransmit_skb() calls",
    "pmid": 251712610,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.rcvcoalesce",
    "text-oneline": "Number of times tried to coalesce the receive queue",
    "text-help": "Number of times tried to coalesce the receive queue",
    "pmid": 251712611,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.ofoqueue",
    "text-oneline": "Number of packets queued in OFO queue",
    "text-help": "Number of packets queued in OFO queue",
    "pmid": 251712612,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.ofodrop",
    "text-oneline": "Number of packets meant to be queued in OFO but dropped due to limits hit",
    "text-help": "Number of packets meant to be queued in OFO but dropped because socket rcvbuf\nlimit reached.",
    "pmid": 251712613,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.ofomerge",
    "text-oneline": "Number of packets in OFO that were merged with other packets",
    "text-help": "Number of packets in OFO that were merged with other packets",
    "pmid": 251712614,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.challengeack",
    "text-oneline": "Number of challenge ACKs sent (RFC 5961 3.2)",
    "text-help": "Number of challenge ACKs sent (RFC 5961 3.2)",
    "pmid": 251712615,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.synchallenge",
    "text-oneline": "Number of challenge ACKs sent in response to SYN packets",
    "text-help": "Number of challenge ACKs sent in response to SYN packets",
    "pmid": 251712616,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopenactive",
    "text-oneline": "Number of successful active fast opens",
    "text-help": "Number of successful active fast opens",
    "pmid": 251712617,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopenactivefail",
    "text-oneline": "Number of fast open attempts failed due to remote not accepting it or time outs",
    "text-help": "Number of fast open attempts failed due to remote not accepting it or time outs",
    "pmid": 251712618,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopenpassive",
    "text-oneline": "Number of successful passive fast opens",
    "text-help": "Number of successful passive fast opens",
    "pmid": 251712619,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopenpassivefail",
    "text-oneline": "Number of passive fast open attempts failed",
    "text-help": "Number of passive fast open attempts failed",
    "pmid": 251712620,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopenlistenoverflow",
    "text-oneline": "Number of times the fastopen listen queue overflowed",
    "text-help": "Number of times the fastopen listen queue overflowed",
    "pmid": 251712621,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fastopencookiereqd",
    "text-oneline": "Number of fast open cookies requested",
    "text-help": "Number of fast open cookies requested",
    "pmid": 251712622,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.spuriousrtxhostqueues",
    "text-oneline": "Number of times that the fast clone is not yet freed in tcp_transmit_skb()",
    "text-help": "Number of times that the fast clone is not yet freed in tcp_transmit_skb()",
    "pmid": 251712623,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.busypollrxpackets",
    "text-oneline": "Number of low latency application-fetched packets",
    "text-help": "Number of low latency application-fetched packets",
    "pmid": 251712624,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.autocorking",
    "text-oneline": "Number of times stack detected skb was underused and its flush was deferred",
    "text-help": "Number of times stack detected skb was underused and its flush was deferred",
    "pmid": 251712625,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.fromzerowindowadv",
    "text-oneline": "Number of times window went from zero to non-zero",
    "text-help": "Number of times window went from zero to non-zero",
    "pmid": 251712626,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.tozerowindowadv",
    "text-oneline": "Number of times window went from non-zero to zero",
    "text-help": "Number of times window went from non-zero to zero",
    "pmid": 251712627,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.wantzerowindowadv",
    "text-oneline": "Number of times zero window announced",
    "text-help": "Number of times zero window announced",
    "pmid": 251712628,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.synretrans",
    "text-oneline": "Number of SYN-SYN/ACK retransmits",
    "text-help": "Number of SYN-SYN/ACK retransmits to break down retransmissions in SYN, fast/timeout\nretransmits.",
    "pmid": 251712629,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.tcp.origdatasent",
    "text-oneline": "Number of outgoing packets with original data",
    "text-help": "Excluding retransmission but including data-in-SYN). This counter is different from\nTcpOutSegs because TcpOutSegs also tracks pure ACKs. TCPOrigDataSent is\nmore useful to track the TCP retransmission rate.",
    "pmid": 251712630,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.indatagrams",
    "text-oneline": "count of udp indatagrams",
    "text-help": "count of udp indatagrams",
    "pmid": 251672646,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.noports",
    "text-oneline": "count of udp noports",
    "text-help": "count of udp noports",
    "pmid": 251672647,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.inerrors",
    "text-oneline": "count of udp inerrors",
    "text-help": "count of udp inerrors",
    "pmid": 251672648,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.outdatagrams",
    "text-oneline": "count of udp outdatagrams",
    "text-help": "count of udp outdatagrams",
    "pmid": 251672650,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.recvbuferrors",
    "text-oneline": "count of udp receive buffer errors",
    "text-help": "count of udp receive buffer errors",
    "pmid": 251672651,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.sndbuferrors",
    "text-oneline": "count of udp send buffer errors",
    "text-help": "count of udp send buffer errors",
    "pmid": 251672652,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp.incsumerrors",
    "text-oneline": "count of udp in checksum errors",
    "text-help": "count of udp in checksum errors",
    "pmid": 251672659,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.indatagrams",
    "text-oneline": "count of udplite indatagrams",
    "text-help": "count of udplite indatagrams",
    "pmid": 251672653,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.noports",
    "text-oneline": "count of udplite noports",
    "text-help": "count of udplite noports",
    "pmid": 251672654,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.inerrors",
    "text-oneline": "count of udplite inerrors",
    "text-help": "count of udplite inerrors",
    "pmid": 251672655,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.outdatagrams",
    "text-oneline": "count of udplite outdatagrams",
    "text-help": "count of udplite outdatagrams",
    "pmid": 251672656,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.recvbuferrors",
    "text-oneline": "count of udplite receive buffer errors",
    "text-help": "count of udplite receive buffer errors",
    "pmid": 251672657,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.sndbuferrors",
    "text-oneline": "count of udplite send buffer errors",
    "text-help": "count of udplite send buffer errors",
    "pmid": 251672658,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite.incsumerrors",
    "text-oneline": "count of udplite in checksum errors",
    "text-help": "count of udplite in checksum errors",
    "pmid": 251672660,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udpconn.established",
    "text-oneline": "Number of established udp connections",
    "text-help": "Number of established udp connections",
    "pmid": 251739137,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.udpconn.listen",
    "text-oneline": "Number of udp connections in listen state",
    "text-help": "Number of udp connections in listen state",
    "pmid": 251739138,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.rawconn.count",
    "text-oneline": "Number of raw socket connections",
    "text-help": "Number of raw socket connections",
    "pmid": 251737089,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.established",
    "text-oneline": "Number of established connections",
    "text-help": "Number of established connections",
    "pmid": 251677697,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.syn_sent",
    "text-oneline": "Number of SYN_SENT connections",
    "text-help": "Number of SYN_SENT connections",
    "pmid": 251677698,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.syn_recv",
    "text-oneline": "Number of SYN_RECV connections",
    "text-help": "Number of SYN_RECV connections",
    "pmid": 251677699,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.fin_wait1",
    "text-oneline": "Number of FIN_WAIT1 connections",
    "text-help": "Number of FIN_WAIT1 connections",
    "pmid": 251677700,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.fin_wait2",
    "text-oneline": "Number of FIN_WAIT2 connections",
    "text-help": "Number of FIN_WAIT2 connections",
    "pmid": 251677701,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.time_wait",
    "text-oneline": "Number of TIME_WAIT connections",
    "text-help": "Number of TIME_WAIT connections",
    "pmid": 251677702,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.close",
    "text-oneline": "Number of CLOSE connections",
    "text-help": "Number of CLOSE connections",
    "pmid": 251677703,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.close_wait",
    "text-oneline": "Number of CLOSE_WAIT connections",
    "text-help": "Number of CLOSE_WAIT connections",
    "pmid": 251677704,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.last_ack",
    "text-oneline": "Number of LAST_ACK connections",
    "text-help": "Number of LAST_ACK connections",
    "pmid": 251677705,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.listen",
    "text-oneline": "Number of LISTEN connections",
    "text-help": "Number of LISTEN connections",
    "pmid": 251677706,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn.closing",
    "text-oneline": "Number of CLOSING connections",
    "text-help": "Number of CLOSING connections",
    "pmid": 251677707,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.softnet.processed",
    "text-oneline": "number of packets (not including netpoll) received by the interrupt handler",
    "text-help": "number of packets (not including netpoll) received by the interrupt handler",
    "pmid": 251716608,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.dropped",
    "text-oneline": "number of packets that were dropped because netdev_max_backlog was exceeded",
    "text-help": "number of packets that were dropped because netdev_max_backlog was exceeded",
    "pmid": 251716609,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.time_squeeze",
    "text-oneline": "number of times ksoftirq ran out of netdev_budget or time slice with work remaining",
    "text-help": "number of times ksoftirq ran out of netdev_budget or time slice with work remaining",
    "pmid": 251716610,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.cpu_collision",
    "text-oneline": "number of times that two cpus collided trying to get the device queue lock",
    "text-help": "number of times that two cpus collided trying to get the device queue lock",
    "pmid": 251716611,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.received_rps",
    "text-oneline": "number of times rps_trigger_softirq has been called",
    "text-help": "number of times rps_trigger_softirq has been called",
    "pmid": 251716612,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.flow_limit_count",
    "text-oneline": "softnet_data flow limit counter",
    "text-help": "softnet_data flow limit counter",
    "pmid": 251716613,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.processed",
    "text-oneline": "number of packets (not including netpoll) received by the interrupt handler",
    "text-help": "number of packets (not including netpoll) received by the interrupt handler",
    "pmid": 251716614,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.dropped",
    "text-oneline": "number of packets that were dropped because netdev_max_backlog was exceeded",
    "text-help": "number of packets that were dropped because netdev_max_backlog was exceeded",
    "pmid": 251716615,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.time_squeeze",
    "text-oneline": "number of times ksoftirq ran out of netdev_budget or time slice with work remaining",
    "text-help": "number of times ksoftirq ran out of netdev_budget or time slice with work remaining",
    "pmid": 251716616,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.cpu_collision",
    "text-oneline": "number of times that two cpus collided trying to get the device queue lock",
    "text-help": "number of times that two cpus collided trying to get the device queue lock",
    "pmid": 251716617,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.received_rps",
    "text-oneline": "number of times rps_trigger_softirq has been called",
    "text-help": "number of times rps_trigger_softirq has been called",
    "pmid": 251716618,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.softnet.percpu.flow_limit_count",
    "text-oneline": "softnet_data flow limit counter",
    "text-help": "The network stack has to drop packets when a receive processing a CPUs\nbacklog reaches netdev_max_backlog.  The flow_limit_count counter is\nthe number of times very active flows have dropped their traffic earlier\nto maintain capacity for other less active flows.",
    "pmid": 251716619,
    "indom": 251658240,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.unix.datagram.count",
    "text-oneline": "Number of datagram unix domain sockets",
    "text-help": "Number of datagram unix domain sockets",
    "pmid": 251741185,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.unix.stream.established",
    "text-oneline": "Number of established unix domain socket streams",
    "text-help": "Number of established unix domain socket streams",
    "pmid": 251741186,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.unix.stream.listen",
    "text-oneline": "Number of unix domain socket streams in listen state",
    "text-help": "Number of unix domain socket streams in listen state",
    "pmid": 251741187,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.unix.stream.count",
    "text-oneline": "Number of unix domain socket streams",
    "text-help": "Number of unix domain socket streams",
    "pmid": 251741188,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.ip6.inreceives",
    "text-oneline": "count of ip6 inreceives",
    "text-help": "count of ip6 inreceives",
    "pmid": 251717632,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inhdrerrors",
    "text-oneline": "count of ip6 inhdrerrors",
    "text-help": "count of ip6 inhdrerrors",
    "pmid": 251717633,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.intoobigerrors",
    "text-oneline": "count of ip6 intoobigerrors",
    "text-help": "count of ip6 intoobigerrors",
    "pmid": 251717634,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.innoroutes",
    "text-oneline": "count of ip6 innoroutes",
    "text-help": "count of ip6 innoroutes",
    "pmid": 251717635,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inaddrerrors",
    "text-oneline": "count of ip6 inaddrerrors",
    "text-help": "count of ip6 inaddrerrors",
    "pmid": 251717636,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inunknownprotos",
    "text-oneline": "count of ip6 inunknownprotos",
    "text-help": "count of ip6 inunknownprotos",
    "pmid": 251717637,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.intruncatedpkts",
    "text-oneline": "count of ip6 intruncatedpkts",
    "text-help": "count of ip6 intruncatedpkts",
    "pmid": 251717638,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.indiscards",
    "text-oneline": "count of ip6 indiscards",
    "text-help": "count of ip6 indiscards",
    "pmid": 251717639,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.indelivers",
    "text-oneline": "count of ip6 indelivers",
    "text-help": "count of ip6 indelivers",
    "pmid": 251717640,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outforwdatagrams",
    "text-oneline": "count of ip6 outforwdatagrams",
    "text-help": "count of ip6 outforwdatagrams",
    "pmid": 251717641,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outrequests",
    "text-oneline": "count of ip6 outrequests",
    "text-help": "count of ip6 outrequests",
    "pmid": 251717642,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outdiscards",
    "text-oneline": "count of ip6 outdiscards",
    "text-help": "count of ip6 outdiscards",
    "pmid": 251717643,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outnoroutes",
    "text-oneline": "count of ip6 outnoroutes",
    "text-help": "count of ip6 outnoroutes",
    "pmid": 251717644,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.reasmtimeout",
    "text-oneline": "count of ip6 reasmtimeout",
    "text-help": "count of ip6 reasmtimeout",
    "pmid": 251717645,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.reasmreqds",
    "text-oneline": "count of ip6 reassembly requireds",
    "text-help": "count of ip6 reassembly requireds",
    "pmid": 251717646,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.reasmoks",
    "text-oneline": "count of ip6 reassembly oks",
    "text-help": "count of ip6 reassembly oks",
    "pmid": 251717647,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.reasmfails",
    "text-oneline": "count of ip6 reassembly failures",
    "text-help": "count of ip6 reassembly failures",
    "pmid": 251717648,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.fragoks",
    "text-oneline": "count of ip6 fragmentation oks",
    "text-help": "count of ip6 fragmentation oks",
    "pmid": 251717649,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.fragfails",
    "text-oneline": "count of ip6 fragmentation failures",
    "text-help": "count of ip6 fragmentation failures",
    "pmid": 251717650,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.fragcreates",
    "text-oneline": "count of ip6 fragmentation creations",
    "text-help": "count of ip6 fragmentation creations",
    "pmid": 251717651,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inmcastpkts",
    "text-oneline": "count of ip6 multicast packets in",
    "text-help": "count of ip6 multicast packets in",
    "pmid": 251717652,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outmcastpkts",
    "text-oneline": "count of ip6 multicast packets out",
    "text-help": "count of ip6 multicast packets out",
    "pmid": 251717653,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inoctets",
    "text-oneline": "count of ip6 octets in",
    "text-help": "count of ip6 octets in",
    "pmid": 251717654,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outoctets",
    "text-oneline": "count of ip6 octets out",
    "text-help": "count of ip6 octets out",
    "pmid": 251717655,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inmcastoctets",
    "text-oneline": "count of ip6 multicast octets in",
    "text-help": "count of ip6 multicast octets in",
    "pmid": 251717656,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outmcastoctets",
    "text-oneline": "count of ip6 multicast octets out",
    "text-help": "count of ip6 multicast octets out",
    "pmid": 251717657,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inbcastoctets",
    "text-oneline": "count of ip6 broadcast octets in",
    "text-help": "count of ip6 broadcast octets in",
    "pmid": 251717658,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.outbcastoctets",
    "text-oneline": "count of ip6 broadcast octets uot",
    "text-help": "count of ip6 broadcast octets uot",
    "pmid": 251717659,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.innoectpkts",
    "text-oneline": "count of ip6 packets received with NOECT",
    "text-help": "count of ip6 packets received with NOECT",
    "pmid": 251717660,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inect1pkts",
    "text-oneline": "count of ip6 packets received with ECT(1)",
    "text-help": "count of ip6 packets received with ECT(1)",
    "pmid": 251717661,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.inect0pkts",
    "text-oneline": "count of ip6 packets received with ECT(0)",
    "text-help": "count of ip6 packets received with ECT(0)",
    "pmid": 251717662,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.ip6.incepkts",
    "text-oneline": "count of ip6 Congestion Experimented packets in",
    "text-help": "count of ip6 Congestion Experimented packets in",
    "pmid": 251717663,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inmsgs",
    "text-oneline": "count of icmp6 inmsgs",
    "text-help": "count of icmp6 inmsgs",
    "pmid": 251717664,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inerrors",
    "text-oneline": "count of icmp6 inerrors",
    "text-help": "count of icmp6 inerrors",
    "pmid": 251717665,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outmsgs",
    "text-oneline": "count of icmp6 outmsgs",
    "text-help": "count of icmp6 outmsgs",
    "pmid": 251717666,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outerrors",
    "text-oneline": "count of icmp6 outerrors",
    "text-help": "count of icmp6 outerrors",
    "pmid": 251717667,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.incsumerrors",
    "text-oneline": "count of icmp6 incsumerrors",
    "text-help": "count of icmp6 incsumerrors",
    "pmid": 251717668,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.indestunreachs",
    "text-oneline": "count of icmp6 indestunreachs",
    "text-help": "count of icmp6 indestunreachs",
    "pmid": 251717669,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inpkttoobigs",
    "text-oneline": "count of icmp6 inpkttoobigs",
    "text-help": "count of icmp6 inpkttoobigs",
    "pmid": 251717670,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.intimeexcds",
    "text-oneline": "count of icmp6 intimeexcds",
    "text-help": "count of icmp6 intimeexcds",
    "pmid": 251717671,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inparmproblems",
    "text-oneline": "count of icmp6 inparmprobs",
    "text-help": "count of icmp6 inparmprobs",
    "pmid": 251717672,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inechos",
    "text-oneline": "count of icmp6 inechos",
    "text-help": "count of icmp6 inechos",
    "pmid": 251717673,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inechoreplies",
    "text-oneline": "count of icmp6 inechoreplies",
    "text-help": "count of icmp6 inechoreplies",
    "pmid": 251717674,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.ingroupmembqueries",
    "text-oneline": "count of icmp6 ingroupmembqueries",
    "text-help": "count of icmp6 ingroupmembqueries",
    "pmid": 251717675,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.ingroupmembresponses",
    "text-oneline": "count of icmp6 ingroupmembresponses",
    "text-help": "count of icmp6 ingroupmembresponses",
    "pmid": 251717676,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.ingroupmembreductions",
    "text-oneline": "count of icmp6 ingroupmembreductions",
    "text-help": "count of icmp6 ingroupmembreductions",
    "pmid": 251717677,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inroutersolicits",
    "text-oneline": "count of icmp6 inroutersolicits",
    "text-help": "count of icmp6 inroutersolicits",
    "pmid": 251717678,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inrouteradvertisements",
    "text-oneline": "count of icmp6 inrouteradvertisements",
    "text-help": "count of icmp6 inrouteradvertisements",
    "pmid": 251717679,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inneighborsolicits",
    "text-oneline": "count of icmp6 inneighborsolicits",
    "text-help": "count of icmp6 inneighborsolicits",
    "pmid": 251717680,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inneighboradvertisements",
    "text-oneline": "count of icmp6 inneighboradvertisements",
    "text-help": "count of icmp6 inneighboradvertisements",
    "pmid": 251717681,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inredirects",
    "text-oneline": "count of icmp6 inredirects",
    "text-help": "count of icmp6 inredirects",
    "pmid": 251717682,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.inmldv2reports",
    "text-oneline": "count of icmp6 inmldv2reports",
    "text-help": "count of icmp6 inmldv2reports",
    "pmid": 251717683,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outdestunreachs",
    "text-oneline": "count of icmp6 outdestunreachs",
    "text-help": "count of icmp6 outdestunreachs",
    "pmid": 251717684,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outpkttoobigs",
    "text-oneline": "count of icmp6 outpkttoobigs",
    "text-help": "count of icmp6 outpkttoobigs",
    "pmid": 251717685,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outtimeexcds",
    "text-oneline": "count of icmp6 outtimeexcds",
    "text-help": "count of icmp6 outtimeexcds",
    "pmid": 251717686,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outparmproblems",
    "text-oneline": "count of icmp6 outparmproblems",
    "text-help": "count of icmp6 outparmproblems",
    "pmid": 251717687,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outechos",
    "text-oneline": "count of icmp6 outechos",
    "text-help": "count of icmp6 outechos",
    "pmid": 251717688,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outechoreplies",
    "text-oneline": "count of icmp6 outechoreplies",
    "text-help": "count of icmp6 outechoreplies",
    "pmid": 251717689,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outgroupmembqueries",
    "text-oneline": "count of icmp6 outgroupmembqueries",
    "text-help": "count of icmp6 outgroupmembqueries",
    "pmid": 251717690,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outgroupmembresponses",
    "text-oneline": "count of icmp6 outgroupmembresponses",
    "text-help": "count of icmp6 outgroupmembresponses",
    "pmid": 251717691,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outgroupmembreductions",
    "text-oneline": "count of icmp6 outgroupmembreductions",
    "text-help": "count of icmp6 outgroupmembreductions",
    "pmid": 251717692,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outroutersolicits",
    "text-oneline": "count of icmp6 outroutersolicits",
    "text-help": "count of icmp6 outroutersolicits",
    "pmid": 251717693,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outrouteradvertisements",
    "text-oneline": "count of icmp6 outrouteradvertisements",
    "text-help": "count of icmp6 outrouteradvertisements",
    "pmid": 251717694,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outneighborsolicits",
    "text-oneline": "count of icmp6 outneighborsolicits",
    "text-help": "count of icmp6 outneighborsolicits",
    "pmid": 251717695,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outneighboradvertisements",
    "text-oneline": "count of icmp6 outneighboradvertisements",
    "text-help": "count of icmp6 outneighboradvertisements",
    "pmid": 251717696,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outredirects",
    "text-oneline": "count of icmp6 outredirects",
    "text-help": "count of icmp6 outredirects",
    "pmid": 251717697,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.icmp6.outmldv2reports",
    "text-oneline": "count of icmp6 outmldv2reports",
    "text-help": "count of icmp6 outmldv2reports",
    "pmid": 251717698,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.indatagrams",
    "text-oneline": "count of udp6 indatagrams",
    "text-help": "count of udp6 indatagrams",
    "pmid": 251717699,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.noports",
    "text-oneline": "count of udp6 noports",
    "text-help": "count of udp6 noports",
    "pmid": 251717700,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.inerrors",
    "text-oneline": "count of udp6 inerrors",
    "text-help": "count of udp6 inerrors",
    "pmid": 251717701,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.outdatagrams",
    "text-oneline": "count of udp6 outdatagrams",
    "text-help": "count of udp6 outdatagrams",
    "pmid": 251717702,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.rcvbuferrors",
    "text-oneline": "count of udp6 rcvbuferrors",
    "text-help": "count of udp6 rcvbuferrors",
    "pmid": 251717703,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.sndbuferrors",
    "text-oneline": "count of udp6 sndbuferrors",
    "text-help": "count of udp6 sndbuferrors",
    "pmid": 251717704,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.incsumerrors",
    "text-oneline": "count of udp6 incsumerrors",
    "text-help": "count of udp6 incsumerrors",
    "pmid": 251717705,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udp6.ignoredmulti",
    "text-oneline": "count of udp6 ignoredmulti",
    "text-help": "count of udp6 ignoredmulti",
    "pmid": 251717706,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udpconn6.established",
    "text-oneline": "Number of established udp6 connections",
    "text-help": "Number of established udp6 connections",
    "pmid": 251740161,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.udpconn6.listen",
    "text-oneline": "Number of udp6 connections in listen state",
    "text-help": "Number of udp6 connections in listen state",
    "pmid": 251740162,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.udplite6.indatagrams",
    "text-oneline": "count of udplite6 indatagrams",
    "text-help": "count of udplite6 indatagrams",
    "pmid": 251717707,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.noports",
    "text-oneline": "count of udplite6 noports",
    "text-help": "count of udplite6 noports",
    "pmid": 251717708,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.inerrors",
    "text-oneline": "count of udplite6 inerrors",
    "text-help": "count of udplite6 inerrors",
    "pmid": 251717709,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.outdatagrams",
    "text-oneline": "count of udplite6 outdatagrams",
    "text-help": "count of udplite6 outdatagrams",
    "pmid": 251717710,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.rcvbuferrors",
    "text-oneline": "count of udplite6 receive buffer errors",
    "text-help": "count of udplite6 receive buffer errors",
    "pmid": 251717711,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.sndbuferrors",
    "text-oneline": "count of udplite6 send buffer errors",
    "text-help": "count of udplite6 send buffer errors",
    "pmid": 251717712,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.udplite6.incsumerrors",
    "text-oneline": "count of udplite6 in checksum errors",
    "text-help": "count of udplite6 in checksum errors",
    "pmid": 251717713,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "network.rawconn6.count",
    "text-oneline": "Number of raw6 socket connections",
    "text-help": "Number of raw6 socket connections",
    "pmid": 251738113,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.established",
    "text-oneline": "Number of established tcp6 connections",
    "text-help": "Number of established tcp6 connections",
    "pmid": 251736065,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.syn_sent",
    "text-oneline": "Number of SYN_SENT tcp6 connections",
    "text-help": "Number of SYN_SENT tcp6 connections",
    "pmid": 251736066,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.syn_recv",
    "text-oneline": "Number of SYN_RECV tcp6 connections",
    "text-help": "Number of SYN_RECV tcp6 connections",
    "pmid": 251736067,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.fin_wait1",
    "text-oneline": "Number of FIN_WAIT1 tcp6 connections",
    "text-help": "Number of FIN_WAIT1 tcp6 connections",
    "pmid": 251736068,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.fin_wait2",
    "text-oneline": "Number of FIN_WAIT2 tcp6 connections",
    "text-help": "Number of FIN_WAIT2 tcp6 connections",
    "pmid": 251736069,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.time_wait",
    "text-oneline": "Number of TIME_WAIT tcp6 connections",
    "text-help": "Number of TIME_WAIT tcp6 connections",
    "pmid": 251736070,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.close",
    "text-oneline": "Number of CLOSE tcp6 connections",
    "text-help": "Number of CLOSE tcp6 connections",
    "pmid": 251736071,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.close_wait",
    "text-oneline": "Number of CLOSE_WAIT tcp6 connections",
    "text-help": "Number of CLOSE_WAIT tcp6 connections",
    "pmid": 251736072,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.last_ack",
    "text-oneline": "Number of LAST_ACK tcp6 connections",
    "text-help": "Number of LAST_ACK tcp6 connections",
    "pmid": 251736073,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.listen",
    "text-oneline": "Number of LISTEN tcp6 connections",
    "text-help": "Number of LISTEN tcp6 connections",
    "pmid": 251736074,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "network.tcpconn6.closing",
    "text-oneline": "Number of CLOSING tcp6 connections",
    "text-help": "Number of CLOSING tcp6 connections",
    "pmid": 251736075,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "disk.dev.read",
    "text-oneline": "per-disk read operations",
    "text-help": "Cumulative number of disk read operations since system boot time (subject\nto counter wrap).",
    "pmid": 251658244,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.write",
    "text-oneline": "per-disk write operations",
    "text-help": "Cumulative number of disk write operations since system boot time (subject\nto counter wrap).",
    "pmid": 251658245,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.total",
    "text-oneline": "per-disk total (read+write) operations",
    "text-help": "Cumulative number of disk read and write operations since system boot\ntime (subject to counter wrap).",
    "pmid": 251658268,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.blkread",
    "text-oneline": "per-disk block read operations",
    "text-help": "Cumulative number of disk block read operations since system boot time\n(subject to counter wrap).",
    "pmid": 251658246,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.blkwrite",
    "text-oneline": "per-disk block write operations",
    "text-help": "Cumulative number of disk block write operations since system boot time\n(subject to counter wrap).",
    "pmid": 251658247,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.blktotal",
    "text-oneline": "per-disk total (read+write) block operations",
    "text-help": "Cumulative number of disk block read and write operations since system\nboot time (subject to counter wrap).",
    "pmid": 251658276,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.read_bytes",
    "text-oneline": "per-disk count of bytes read",
    "text-help": "per-disk count of bytes read",
    "pmid": 251658278,
    "indom": 251658241,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dev.write_bytes",
    "text-oneline": "per-disk count of bytes written",
    "text-help": "per-disk count of bytes written",
    "pmid": 251658279,
    "indom": 251658241,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dev.total_bytes",
    "text-oneline": "per-disk count of total bytes read and written",
    "text-help": "per-disk count of total bytes read and written",
    "pmid": 251658280,
    "indom": 251658241,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dev.read_merge",
    "text-oneline": "per-disk count of merged read requests",
    "text-help": "Count of read requests that were merged with an already queued read request.",
    "pmid": 251658289,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.write_merge",
    "text-oneline": "per-disk count of merged write requests",
    "text-help": "Count of write requests that were merged with an already queued write request.",
    "pmid": 251658290,
    "indom": 251658241,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dev.avactive",
    "text-oneline": "per-disk count of active time",
    "text-help": "Counts the number of milliseconds for which at least one I/O is in\nprogress for each device.\n\nWhen converted to a rate, this metric represents the average utilization of\nthe disk during the sampling interval.  A value of 0.5 (or 50%) means the\ndisk was active (i.e. busy) half the time.",
    "pmid": 251658286,
    "indom": 251658241,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dev.read_rawactive",
    "text-oneline": "per-disk raw count of read response time",
    "text-help": "For each completed read on each disk the response time (queue time plus\nservice time) in milliseconds is added to the associated instance of\nthis metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding reads for a disk.  When divided by the number\nof completed reads for a disk (disk.dev.read), the value represents the\nstochastic average of the read response (or wait) time for that disk.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dev.r_await = delta(disk.dev.read_rawactive) / delta(disk.dev.read)",
    "pmid": 251658312,
    "indom": 251658241,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dev.write_rawactive",
    "text-oneline": "per-disk raw count of write response time",
    "text-help": "For each completed write on each disk the response time (queue time plus\nservice time) in milliseconds is added to the associated instance of\nthis metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding writes for a disk.  When divided by\nthe number of completed writes for a disk (disk.dev.write), the value\nrepresents the stochastic average of the write response (or wait)\ntime for that disk.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dev.w_await = delta(disk.dev.write_rawactive) / delta(disk.dev.write)",
    "pmid": 251658313,
    "indom": 251658241,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dev.total_rawactive",
    "text-oneline": "per-disk raw count of I/O response time",
    "text-help": "For each completed I/O on each disk the response time (queue time plus\nservice time) in milliseconds is added to the associated instance of\nthis metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding I/Os for a disk.  When divided by the number\nof completed I/Os for a disk (disk.dev.total), the value represents the\nstochastic average of the I/O response (or wait) time for that disk.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dev.await = delta(disk.dev.total_rawactive) / delta(disk.dev.total)",
    "pmid": 251658319,
    "indom": 251658241,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dev.aveq",
    "text-oneline": "per-disk time averaged count of request queue length",
    "text-help": "When converted to a rate, this metric represents the time averaged disk\nrequest queue length during the sampling interval.  A value of 2.5 (or 250%)\nrepresents a time averaged queue length of 2.5 requests during the sampling\ninterval.",
    "pmid": 251658287,
    "indom": 251658241,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dev.scheduler",
    "text-oneline": "per-disk I/O scheduler",
    "text-help": "The name of the I/O scheduler in use for each device.  The scheduler\nis part of the block layer in the kernel, and attempts to optimise the\nI/O submission patterns using various techniques (typically, sorting\nand merging adjacent requests into larger ones to reduce seek activity,\nbut certainly not limited to that).",
    "pmid": 251658299,
    "indom": 251658241,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "disk.dev.capacity",
    "text-oneline": "per-disk physical device capacity",
    "text-help": "Total space presented by each block device, from /proc/partitions.",
    "pmid": 251658327,
    "indom": 251658241,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "disk.all.read",
    "text-oneline": "total read operations, summed for all disks",
    "text-help": "Cumulative number of disk read operations since system boot time\n(subject to counter wrap), summed over all disk devices.",
    "pmid": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.write",
    "text-oneline": "total write operations, summed for all disks",
    "text-help": "Cumulative number of disk read operations since system boot time\n(subject to counter wrap), summed over all disk devices.",
    "pmid": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.total",
    "text-oneline": "total (read+write) operations, summed for all disks",
    "text-help": "Cumulative number of disk read and write operations since system boot\ntime (subject to counter wrap), summed over all disk devices.",
    "pmid": 251658269,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.blkread",
    "text-oneline": "block read operations, summed for all disks",
    "text-help": "Cumulative number of disk block read operations since system boot time\n(subject to counter wrap), summed over all disk devices.",
    "pmid": 251658266,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.blkwrite",
    "text-oneline": "block write operations, summed for all disks",
    "text-help": "Cumulative number of disk block write operations since system boot time\n(subject to counter wrap), summed over all disk devices.",
    "pmid": 251658267,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.blktotal",
    "text-oneline": "total (read+write) block operations, summed for all disks",
    "text-help": "Cumulative number of disk block read and write operations since system\nboot time (subject to counter wrap), summed over all disk devices.",
    "pmid": 251658277,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.read_bytes",
    "text-oneline": "count of bytes read for all disk devices",
    "text-help": "count of bytes read for all disk devices",
    "pmid": 251658281,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.all.write_bytes",
    "text-oneline": "count of bytes written for all disk devices",
    "text-help": "count of bytes written for all disk devices",
    "pmid": 251658282,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.all.total_bytes",
    "text-oneline": "total count of bytes read and written for all disk devices",
    "text-help": "total count of bytes read and written for all disk devices",
    "pmid": 251658283,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.all.read_merge",
    "text-oneline": "total count of merged read requests, summed for all disks",
    "text-help": "Total count of read requests that were merged with an already queued read request.",
    "pmid": 251658291,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.write_merge",
    "text-oneline": "total count of merged write requests, summed for all disks",
    "text-help": "Total count of write requests that were merged with an already queued write request.",
    "pmid": 251658292,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.all.avactive",
    "text-oneline": "total count of active time, summed for all disks",
    "text-help": "Counts the number of milliseconds for which at least one I/O is in\nprogress on each disk, summed across all disks.\n\nWhen converted to a rate and divided by the number of disks (hinv.ndisk),\nthis metric represents the average utilization of all disks during the\nsampling interval.  A value of 0.25 (or 25%) means that on average every\ndisk was active (i.e. busy) one quarter of the time.",
    "pmid": 251658284,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "disk.all.read_rawactive",
    "text-oneline": "raw count of read response time, summed for all disks",
    "text-help": "For each completed read on every disk the response time (queue time plus\nservice time) in milliseconds is added to this metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding reads across all disks.  When divided\nby the number of completed reads for all disks (disk.all.read), value\nrepresents the stochastic average of the read response (or wait) time\nacross all disks.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.all.r_await = delta(disk.all.read_rawactive) / delta(disk.all.read)",
    "pmid": 251658314,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "disk.all.write_rawactive",
    "text-oneline": "raw count of write response time, summed for all disks",
    "text-help": "For each completed write on every disk the response time (queue time\nplus service time) in milliseconds is added to this metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding writes across all disks.  When divided by\nthe number of completed writes for all disks (disk.all.write), value\nrepresents the stochastic average of the write response (or wait) time\nacross all disks.",
    "pmid": 251658315,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "disk.all.total_rawactive",
    "text-oneline": "raw count of I/O response time, summed for all disks",
    "text-help": "For each completed I/O on every disk the response time (queue time\nplus service time) in milliseconds is added to this metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding I/Os across all disks.  When divided by\nthe number of completed I/Os for all disks (disk.all.total), value\nrepresents the stochastic average of the I/O response (or wait) time\nacross all disks.",
    "pmid": 251658320,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "disk.all.aveq",
    "text-oneline": "total time averaged count of request queue length, summed for all disks",
    "text-help": "When converted to a rate, this metric represents the average across all disks\nof the time averaged request queue length during the sampling interval.  A\nvalue of 1.5 (or 150%) suggests that (on average) each all disk experienced a\ntime averaged queue length of 1.5 requests during the sampling interval.",
    "pmid": 251658285,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "disk.partitions.read",
    "text-oneline": "read operations metric for storage partitions",
    "text-help": "Cumulative number of disk read operations since system boot time\n(subject to counter wrap) for individual disk partitions or logical\nvolumes.",
    "pmid": 251668480,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.write",
    "text-oneline": "write operations metric for storage partitions",
    "text-help": "Cumulative number of disk write operations since system boot time\n(subject to counter wrap) for individual disk partitions or logical\nvolumes.",
    "pmid": 251668481,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.total",
    "text-oneline": "total (read+write) I/O operations metric for storage partitions",
    "text-help": "Cumulative number of disk read and write operations since system boot\ntime (subject to counter wrap) for individual disk partitions or\nlogical volumes.",
    "pmid": 251668482,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "disk.partitions.blkread",
    "text-oneline": "block read operations metric for storage partitions",
    "text-help": "Cumulative number of disk block read operations since system boot time\n(subject to counter wrap) for individual disk partitions or logical\nvolumes.",
    "pmid": 251668483,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.blkwrite",
    "text-oneline": "block write operations metric for storage partitions",
    "text-help": "Cumulative number of disk block write operations since system boot time\n(subject to counter wrap) for individual disk partitions or logical\nvolumes.",
    "pmid": 251668484,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.blktotal",
    "text-oneline": "total (read+write) block operations metric for storage partitions",
    "text-help": "Cumulative number of disk block read and write operations since system\nboot time (subject to counter wrap) for individual disk partitions or\nlogical volumes.",
    "pmid": 251668485,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "disk.partitions.read_bytes",
    "text-oneline": "number of bytes read for storage partitions",
    "text-help": "Cumulative number of bytes read since system boot time (subject to\ncounter wrap) for individual disk partitions or logical volumes.",
    "pmid": 251668486,
    "indom": 251658250,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.partitions.write_bytes",
    "text-oneline": "number of bytes written for storage partitions",
    "text-help": "Cumulative number of bytes written since system boot time (subject to\ncounter wrap) for individual disk partitions or logical volumes.",
    "pmid": 251668487,
    "indom": 251658250,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.partitions.total_bytes",
    "text-oneline": "total number of bytes read and written for storage partitions",
    "text-help": "Cumulative number of bytes read and written since system boot time\n(subject to counter wrap) for individual disk partitions or logical\nvolumes.",
    "pmid": 251668488,
    "indom": 251658250,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.partitions.read_merge",
    "text-oneline": "per-disk-partition count of merged read requests",
    "text-help": "per-disk-partition count of merged read requests",
    "pmid": 251668489,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.write_merge",
    "text-oneline": "per-disk-partition count of merged write requests",
    "text-help": "per-disk-partition count of merged write requests",
    "pmid": 251668490,
    "indom": 251658250,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.partitions.avactive",
    "text-oneline": "per-disk-partition device count of active time",
    "text-help": "Counts the number of milliseconds for which at least one I/O is in\nprogress for each disk partition.\n\nWhen converted to a rate, this metric represents the average utilization\nof the disk partition during the sampling interval.  A value of 0.5\n(or 50%) means the disk partition was active (i.e. busy) half the time.",
    "pmid": 251668491,
    "indom": 251658250,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.partitions.aveq",
    "text-oneline": "per-disk-partition device time averaged count of request queue length",
    "text-help": "per-disk-partition device time averaged count of request queue length",
    "pmid": 251668492,
    "indom": 251658250,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.partitions.read_rawactive",
    "text-oneline": "per-disk-partition raw count of read response time",
    "text-help": "For each completed read on each disk partition the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time average\nof the number of outstanding reads for a disk partition.  When divided by\nthe number of completed reads for a disk partition (disk.partitions.read),\nthe value represents the stochastic average of the read response (or wait)\ntime for that disk partition.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.partitions.r_await = delta(disk.partitions.read_rawactive) /\n                             delta(disk.partitions.read)",
    "pmid": 251668493,
    "indom": 251658250,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.partitions.write_rawactive",
    "text-oneline": "per-disk-partition raw count of write response time",
    "text-help": "For each completed write on each disk partition the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding writes for a disk partition.\nWhen divided by the number of completed writes for a disk partition\n(disk.partitions.write), the value represents the stochastic average of\nthe write response (or wait) time for that disk partition.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.partitions.w_await = delta(disk.partitions.write_rawactive) /\n                             delta(disk.partitions.write)",
    "pmid": 251668494,
    "indom": 251658250,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.partitions.total_rawactive",
    "text-oneline": "per-disk-partition raw count of I/O response time",
    "text-help": "For each completed I/O on each disk partition the response time (queue\ntime plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding I/Os for a disk partition.\nWhen divided by the number of completed I/Os for a disk partition\n(disk.partitions.total), the value represents the stochastic average of\nthe I/O response (or wait) time for that disk partition.",
    "pmid": 251668495,
    "indom": 251658250,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.partitions.capacity",
    "text-oneline": "per-disk-partition capacity",
    "text-help": "Total space presented by each disk partition, from /proc/partitions.",
    "pmid": 251668496,
    "indom": 251658250,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "disk.dm.read",
    "text-oneline": "per-device-mapper device read operations",
    "text-help": "per-device-mapper device read operations",
    "pmid": 251713536,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.write",
    "text-oneline": "per-device-mapper device write operations",
    "text-help": "per-device-mapper device write operations",
    "pmid": 251713537,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.total",
    "text-oneline": "per-device-mapper device total (read+write) operations",
    "text-help": "per-device-mapper device total (read+write) operations",
    "pmid": 251713538,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.blkread",
    "text-oneline": "per-device-mapper device block read operations",
    "text-help": "per-device-mapper device block read operations",
    "pmid": 251713539,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.blkwrite",
    "text-oneline": "per-device-mapper device block write operations",
    "text-help": "per-device-mapper device block write operations",
    "pmid": 251713540,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.blktotal",
    "text-oneline": "per-device-mapper device total (read+write) block operations",
    "text-help": "per-device-mapper device total (read+write) block operations",
    "pmid": 251713541,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.read_bytes",
    "text-oneline": "per-device-mapper device count of bytes read",
    "text-help": "per-device-mapper device count of bytes read",
    "pmid": 251713542,
    "indom": 251658264,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dm.write_bytes",
    "text-oneline": "per-device-mapper device count of bytes written",
    "text-help": "per-device-mapper device count of bytes written",
    "pmid": 251713543,
    "indom": 251658264,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dm.total_bytes",
    "text-oneline": "per-device-mapper device count of total bytes read and written",
    "text-help": "per-device-mapper device count of total bytes read and written",
    "pmid": 251713544,
    "indom": 251658264,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.dm.read_merge",
    "text-oneline": "per-device-mapper device count of merged read requests",
    "text-help": "per-device-mapper device count of merged read requests",
    "pmid": 251713545,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.write_merge",
    "text-oneline": "per-device-mapper device count of merged write requests",
    "text-help": "per-device-mapper device count of merged write requests",
    "pmid": 251713546,
    "indom": 251658264,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.dm.avactive",
    "text-oneline": "per-device-mapper device count of active time",
    "text-help": "Counts the number of milliseconds for which at least one I/O is in\nprogress for each device-mapper device.\n\nWhen converted to a rate, this metric represents the average utilization\nof the device during the sampling interval.  A value of 0.5 (or 50%)\nmeans the device was active (i.e. busy) half the time.",
    "pmid": 251713547,
    "indom": 251658264,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dm.aveq",
    "text-oneline": "per-device-mapper device time averaged count of request queue length",
    "text-help": "per-device-mapper device time averaged count of request queue length",
    "pmid": 251713548,
    "indom": 251658264,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dm.read_rawactive",
    "text-oneline": "per-device-mapper raw count of read response time",
    "text-help": "For each completed read on each device-mapper device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding reads for a device-mapper device.\nWhen divided by the number of completed reads for a device-mapper device\n(disk.dm.read), the value represents the stochastic average of the read\nresponse (or wait) time for that device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dm.r_await = delta(disk.dm.read_rawactive) / delta(disk.dm.read)",
    "pmid": 251713550,
    "indom": 251658264,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dm.write_rawactive",
    "text-oneline": "per-device-mapper raw count of write response time",
    "text-help": "For each completed write on each device-mapper device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding writes for a device-mapper device.\nWhen divided by the number of completed writes for a device-mapper device\n(disk.dm.write), the value represents the stochastic average of the\nwrite response (or wait) time for that device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dm.w_await = delta(disk.dm.write_rawactive) / delta(disk.dm.write)",
    "pmid": 251713551,
    "indom": 251658264,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dm.total_rawactive",
    "text-oneline": "per-device-mapper raw count of I/O response time",
    "text-help": "For each completed I/O on each device-mapper device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding I/Os for a device-mapper device.\nWhen divided by the number of completed I/Os for a device-mapper device\n(disk.dm.total), the value represents the stochastic average of the I/O\nresponse (or wait) time for that device-mapper device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.dm.await = delta(disk.dm.total_rawactive) / delta(disk.dm.total)",
    "pmid": 251713552,
    "indom": 251658264,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.dm.capacity",
    "text-oneline": "per-device-mapper physical device capacity",
    "text-help": "Total space presented by each device mapper device, from /proc/partitions.",
    "pmid": 251713553,
    "indom": 251658264,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "disk.md.read",
    "text-oneline": "per-multi-device device read operations",
    "text-help": "per-multi-device device read operations",
    "pmid": 251718656,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.write",
    "text-oneline": "per-multi-device device write operations",
    "text-help": "per-multi-device device write operations",
    "pmid": 251718657,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.total",
    "text-oneline": "per-multi-device device total (read+write) operations",
    "text-help": "per-multi-device device total (read+write) operations",
    "pmid": 251718658,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.blkread",
    "text-oneline": "per-multi-device device block read operations",
    "text-help": "per-multi-device device block read operations",
    "pmid": 251718659,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.blkwrite",
    "text-oneline": "per-multi-device device block write operations",
    "text-help": "per-multi-device device block write operations",
    "pmid": 251718660,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.blktotal",
    "text-oneline": "per-multi-device device total (read+write) block operations",
    "text-help": "per-multi-device device total (read+write) block operations",
    "pmid": 251718661,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.read_bytes",
    "text-oneline": "per-multi-device device count of bytes read",
    "text-help": "per-multi-device device count of bytes read",
    "pmid": 251718662,
    "indom": 251658265,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.md.write_bytes",
    "text-oneline": "per-multi-device device count of bytes written",
    "text-help": "per-multi-device device count of bytes written",
    "pmid": 251718663,
    "indom": 251658265,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.md.total_bytes",
    "text-oneline": "per-multi-device device count of total bytes read and written",
    "text-help": "per-multi-device device count of total bytes read and written",
    "pmid": 251718664,
    "indom": 251658265,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "disk.md.read_merge",
    "text-oneline": "per-multi-device device count of merged read requests",
    "text-help": "per-multi-device device count of merged read requests",
    "pmid": 251718665,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.write_merge",
    "text-oneline": "per-multi-device device count of merged write requests",
    "text-help": "per-multi-device device count of merged write requests",
    "pmid": 251718666,
    "indom": 251658265,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "disk.md.avactive",
    "text-oneline": "per-multi-device device count of active time",
    "text-help": "Counts the number of milliseconds for which at least one I/O is in\nprogress for each multi-device device.\n\nWhen converted to a rate, this metric represents the average utilization\nof the device during the sampling interval.  A value of 0.5 (or 50%)\nmeans the device was active (i.e. busy) half the time.",
    "pmid": 251718667,
    "indom": 251658265,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.md.aveq",
    "text-oneline": "per-multi-device device time averaged count of request queue length",
    "text-help": "per-multi-device device time averaged count of request queue length",
    "pmid": 251718668,
    "indom": 251658265,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.md.read_rawactive",
    "text-oneline": "per-multi-device raw count of read response time",
    "text-help": "For each completed read on each multi-device device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding reads for a multi-device device.\nWhen divided by the number of completed reads for a multi-device device\n(disk.md.read), the value represents the stochastic average of the read\nresponse (or wait) time for that device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.md.r_await = delta(disk.md.read_rawactive) / delta(disk.md.read)",
    "pmid": 251718670,
    "indom": 251658265,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.md.write_rawactive",
    "text-oneline": "per-multi-device raw count of write response time",
    "text-help": "For each completed write on each multi-device device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding writes for a multi-device device.\nWhen divided by the number of completed writes for a multi-device device\n(disk.md.write), the value represents the stochastic average of the\nwrite response (or wait) time for that device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.md.w_await = delta(disk.md.write_rawactive) / delta(disk.md.write)",
    "pmid": 251718671,
    "indom": 251658265,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.md.total_rawactive",
    "text-oneline": "per-multi-device raw count of I/O response time",
    "text-help": "For each completed I/O on each multi-device device the response time\n(queue time plus service time) in milliseconds is added to the associated\ninstance of this metric.\n\nWhen converted to a normalized rate, the value represents the time\naverage of the number of outstanding I/Os for a multi-device device.\nWhen divided by the number of completed I/Os for a multi-device device\n(disk.md.total), the value represents the stochastic average of the I/O\nresponse (or wait) time for that multi-device device.\n\nIt is suitable mainly for use in calculations with other metrics,\ne.g. mirroring the results from existing performance tools:\n\n iostat.md.await = delta(disk.md.total_rawactive) / delta(disk.md.total)",
    "pmid": 251718672,
    "indom": 251658265,
    "sem": "counter",
    "units": "millisec",
    "type": "U32"
  },
  {
    "name": "disk.md.status",
    "text-oneline": "per-multi-device \"mdadm --test --detail <device>\" return code",
    "text-help": "per-multi-device \"mdadm --test --detail <device>\" return code",
    "pmid": 251719680,
    "indom": 251658265,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "disk.md.capacity",
    "text-oneline": "per-multi-device device capacity",
    "text-help": "Total space presented by each multi-device device, from /proc/partitions.",
    "pmid": 251718673,
    "indom": 251658265,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "filesys.capacity",
    "text-oneline": "Total capacity of mounted filesystem (Kbytes)",
    "text-help": "Total capacity of mounted filesystem (Kbytes)",
    "pmid": 251663361,
    "indom": 251658245,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "filesys.used",
    "text-oneline": "Total space used on mounted filesystem (Kbytes)",
    "text-help": "Total space used on mounted filesystem (Kbytes)",
    "pmid": 251663362,
    "indom": 251658245,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "filesys.free",
    "text-oneline": "Total space free on mounted filesystem (Kbytes)",
    "text-help": "Total space free on mounted filesystem (Kbytes)",
    "pmid": 251663363,
    "indom": 251658245,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "filesys.maxfiles",
    "text-oneline": "Inodes capacity of mounted filesystem",
    "text-help": "Inodes capacity of mounted filesystem",
    "pmid": 251663364,
    "indom": 251658245,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "filesys.usedfiles",
    "text-oneline": "Number of inodes allocated on mounted filesystem",
    "text-help": "Number of inodes allocated on mounted filesystem",
    "pmid": 251663365,
    "indom": 251658245,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "filesys.freefiles",
    "text-oneline": "Number of unallocated inodes on mounted filesystem",
    "text-help": "Number of unallocated inodes on mounted filesystem",
    "pmid": 251663366,
    "indom": 251658245,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "filesys.mountdir",
    "text-oneline": "File system mount point",
    "text-help": "File system mount point",
    "pmid": 251663367,
    "indom": 251658245,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "filesys.full",
    "text-oneline": "Percentage of filesystem in use",
    "text-help": "Percentage of filesystem in use",
    "pmid": 251663368,
    "indom": 251658245,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "filesys.blocksize",
    "text-oneline": "Size of each block on mounted filesystem (Bytes)",
    "text-help": "Size of each block on mounted filesystem (Bytes)",
    "pmid": 251663369,
    "indom": 251658245,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "filesys.avail",
    "text-oneline": "Total space free to non-superusers on mounted filesystem (Kbytes)",
    "text-help": "Total space free to non-superusers on mounted filesystem (Kbytes)",
    "pmid": 251663370,
    "indom": 251658245,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "filesys.readonly",
    "text-oneline": "Indicates whether a filesystem is mounted readonly",
    "text-help": "Indicates whether a filesystem is mounted readonly",
    "pmid": 251663371,
    "indom": 251658245,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "swapdev.free",
    "text-oneline": "physical swap free space",
    "text-help": "physical swap free space",
    "pmid": 251664384,
    "indom": 251658246,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "swapdev.length",
    "text-oneline": "physical swap size",
    "text-help": "physical swap size",
    "pmid": 251664385,
    "indom": 251658246,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "swapdev.maxswap",
    "text-oneline": "maximum swap length (same as swapdev.length on Linux)",
    "text-help": "maximum swap length (same as swapdev.length on Linux)",
    "pmid": 251664386,
    "indom": 251658246,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "swapdev.vlength",
    "text-oneline": "virtual swap size (always zero on Linux)",
    "text-help": "Virtual swap size (always zero on Linux since Linux does not support\nvirtual swap).\n\nThis metric is retained on Linux for interoperability with PCP monitor\ntools running on IRIX.",
    "pmid": 251664387,
    "indom": 251658246,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "swapdev.priority",
    "text-oneline": "swap resource priority",
    "text-help": "swap resource priority",
    "pmid": 251664388,
    "indom": 251658246,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "rpc.client.rpccnt",
    "text-oneline": "cumulative total of client RPC requests",
    "text-help": "cumulative total of client RPC requests",
    "pmid": 251665428,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.rpcretrans",
    "text-oneline": "cumulative total of client RPC retransmissions",
    "text-help": "cumulative total of client RPC retransmissions",
    "pmid": 251665429,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.rpcauthrefresh",
    "text-oneline": "cumulative total of client RPC auth refreshes",
    "text-help": "cumulative total of client RPC auth refreshes",
    "pmid": 251665430,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.netcnt",
    "text-oneline": "cumulative total of client RPC network layer requests",
    "text-help": "cumulative total of client RPC network layer requests",
    "pmid": 251665432,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.netudpcnt",
    "text-oneline": "cumulative total of client RPC UDP network layer requests",
    "text-help": "cumulative total of client RPC UDP network layer requests",
    "pmid": 251665433,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.nettcpcnt",
    "text-oneline": "cumulative total of client RPC TCP network layer requests",
    "text-help": "cumulative total of client RPC TCP network layer requests",
    "pmid": 251665434,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.client.nettcpconn",
    "text-oneline": "cumulative total of client RPC TCP network layer connection requests",
    "text-help": "cumulative total of client RPC TCP network layer connection requests",
    "pmid": 251665435,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rpccnt",
    "text-oneline": "cumulative total of server RPC requests",
    "text-help": "cumulative total of server RPC requests",
    "pmid": 251665438,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rpcerr",
    "text-oneline": "cumulative total of server RPC errors",
    "text-help": "cumulative total of server RPC errors",
    "pmid": 251665439,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rpcbadfmt",
    "text-oneline": "cumulative total of server RPC bad format errors",
    "text-help": "cumulative total of server RPC bad format errors",
    "pmid": 251665440,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rpcbadauth",
    "text-oneline": "cumulative total of server RPC bad auth errors",
    "text-help": "cumulative total of server RPC bad auth errors",
    "pmid": 251665441,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rpcbadclnt",
    "text-oneline": "cumulative total of server RPC bad client errors",
    "text-help": "cumulative total of server RPC bad client errors",
    "pmid": 251665442,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rchits",
    "text-oneline": "cumulative total of request-reply-cache hits",
    "text-help": "cumulative total of request-reply-cache hits",
    "pmid": 251665443,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rcmisses",
    "text-oneline": "cumulative total of request-reply-cache misses",
    "text-help": "cumulative total of request-reply-cache misses",
    "pmid": 251665444,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.rcnocache",
    "text-oneline": "cumulative total of uncached request-reply-cache requests",
    "text-help": "cumulative total of uncached request-reply-cache requests",
    "pmid": 251665445,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_cached",
    "text-oneline": "cumulative total of file handle cache requests",
    "text-help": "cumulative total of file handle cache requests",
    "pmid": 251665446,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_valid",
    "text-oneline": "cumulative total of file handle cache validations",
    "text-help": "cumulative total of file handle cache validations",
    "pmid": 251665447,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_fixup",
    "text-oneline": "cumulative total of file handle cache fixup validations",
    "text-help": "cumulative total of file handle cache fixup validations",
    "pmid": 251665448,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_lookup",
    "text-oneline": "cumulative total of file handle cache new lookups",
    "text-help": "cumulative total of file handle cache new lookups",
    "pmid": 251665449,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_stale",
    "text-oneline": "cumulative total of stale file handle cache errors",
    "text-help": "cumulative total of stale file handle cache errors",
    "pmid": 251665450,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_concurrent",
    "text-oneline": "cumulative total of concurrent file handle cache requests",
    "text-help": "cumulative total of concurrent file handle cache requests",
    "pmid": 251665451,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.netcnt",
    "text-oneline": "cumulative total of server RPC network layer requests",
    "text-help": "cumulative total of server RPC network layer requests",
    "pmid": 251665452,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.netudpcnt",
    "text-oneline": "cumulative total of server RPC UDP network layer requests",
    "text-help": "cumulative total of server RPC UDP network layer requests",
    "pmid": 251665453,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.nettcpcnt",
    "text-oneline": "cumulative total of server RPC TCP network layer requests",
    "text-help": "cumulative total of server RPC TCP network layer requests",
    "pmid": 251665454,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.nettcpconn",
    "text-oneline": "cumulative total of server RPC TCP network layer connection requests",
    "text-help": "cumulative total of server RPC TCP network layer connection requests",
    "pmid": 251665455,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_anon",
    "text-oneline": "cumulative total anonymous file dentries returned",
    "text-help": "cumulative total anonymous file dentries returned",
    "pmid": 251665459,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_nocache_dir",
    "text-oneline": "count of directory file handles not found cached",
    "text-help": "count of directory file handles not found cached",
    "pmid": 251665460,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.fh_nocache_nondir",
    "text-oneline": "count of non-directory file handles not found cached",
    "text-help": "count of non-directory file handles not found cached",
    "pmid": 251665461,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.io_read",
    "text-oneline": "cumulative count of bytes returned from read requests",
    "text-help": "cumulative count of bytes returned from read requests",
    "pmid": 251665462,
    "sem": "counter",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "rpc.server.io_write",
    "text-oneline": "cumulative count of bytes passed into write requests",
    "text-help": "cumulative count of bytes passed into write requests",
    "pmid": 251665463,
    "sem": "counter",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "rpc.server.th_cnt",
    "text-oneline": "available nfsd threads",
    "text-help": "available nfsd threads",
    "pmid": 251665464,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.th_fullcnt",
    "text-oneline": "number of times the last free nfsd thread was used",
    "text-help": "number of times the last free nfsd thread was used",
    "pmid": 251665465,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.ra_size",
    "text-oneline": "size of read-ahead params cache",
    "text-help": "size of read-ahead params cache",
    "pmid": 251665476,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.ra_hits",
    "text-oneline": "count of read-ahead params cache hits",
    "text-help": "count of read-ahead params cache hits",
    "pmid": 251665477,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "rpc.server.ra_misses",
    "text-oneline": "count of read-ahead params cache misses",
    "text-help": "count of read-ahead params cache misses",
    "pmid": 251665478,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.client.calls",
    "text-oneline": "cumulative total of client NFSv2 requests",
    "text-help": "cumulative total of client NFSv2 requests",
    "pmid": 251665409,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.client.reqs",
    "text-oneline": "cumulative total of client NFSv2 requests by request type",
    "text-help": "cumulative total of client NFSv2 requests by request type",
    "pmid": 251665412,
    "indom": 251658247,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.server.calls",
    "text-oneline": "cumulative total of server NFSv2 requests",
    "text-help": "cumulative total of server NFSv2 requests",
    "pmid": 251665458,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.server.reqs",
    "text-oneline": "cumulative total of client NFSv2 requests by request type",
    "text-help": "cumulative total of client NFSv2 requests by request type",
    "pmid": 251665420,
    "indom": 251658247,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.server.threads.total",
    "text-oneline": "number of nfsd threads running",
    "text-help": "number of nfsd threads running",
    "pmid": 251665479,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.server.threads.pools",
    "text-oneline": "number of thread pools",
    "text-help": "number of thread pools",
    "pmid": 251665480,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs.server.threads.requests",
    "text-oneline": "cumulative total of requests received",
    "text-help": "cumulative total of requests received",
    "pmid": 251665481,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nfs.server.threads.enqueued",
    "text-oneline": "cumulative total of requests that had to wait to be processed",
    "text-help": "cumulative total of requests that had to wait to be processed",
    "pmid": 251665482,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nfs.server.threads.processed",
    "text-oneline": "cumulative total of requests processed immediately",
    "text-help": "cumulative total of requests processed immediately",
    "pmid": 251665483,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nfs.server.threads.timedout",
    "text-oneline": "cumulative total of threads that timedout from inactivity",
    "text-help": "cumulative total of threads that timedout from inactivity",
    "pmid": 251665484,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nfs3.client.calls",
    "text-oneline": "cumulative total of client NFSv3 requests",
    "text-help": "cumulative total of client NFSv3 requests",
    "pmid": 251665468,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs3.client.reqs",
    "text-oneline": "cumulative total of client NFSv3 requests by request type",
    "text-help": "cumulative total of client NFSv3 requests by request type",
    "pmid": 251665469,
    "indom": 251658248,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs3.server.calls",
    "text-oneline": "cumulative total of server NFSv3 requests",
    "text-help": "cumulative total of server NFSv3 requests",
    "pmid": 251665470,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs3.server.reqs",
    "text-oneline": "cumulative total of client NFSv3 requests by request type",
    "text-help": "cumulative total of client NFSv3 requests by request type",
    "pmid": 251665471,
    "indom": 251658248,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs4.client.calls",
    "text-oneline": "cumulative total of client NFSv4 requests",
    "text-help": "cumulative total of client NFSv4 requests",
    "pmid": 251665472,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs4.client.reqs",
    "text-oneline": "cumulative total for each client NFSv4 request type",
    "text-help": "cumulative total for each client NFSv4 request type",
    "pmid": 251665473,
    "indom": 251658254,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs4.server.calls",
    "text-oneline": "cumulative total of server NFSv4 operations, plus NULL requests",
    "text-help": "cumulative total of server NFSv4 operations, plus NULL requests",
    "pmid": 251665474,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "nfs4.server.reqs",
    "text-oneline": "cumulative total for each server NFSv4 operation, and for NULL requests",
    "text-help": "cumulative total for each server NFSv4 operation, and for NULL requests",
    "pmid": 251665475,
    "indom": 251658255,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmda.uname",
    "text-oneline": "identity and type of current system",
    "text-help": "Identity and type of current system.  The concatenation of the values\nreturned from utsname(2), also similar to uname -a.\n\nSee also the kernel.uname.* metrics",
    "pmid": 251670533,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmda.version",
    "text-oneline": "build version of Linux PMDA",
    "text-help": "build version of Linux PMDA",
    "pmid": 251670534,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.sem.max_semmap",
    "text-oneline": "maximum number of entries in a semaphore map (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of entries in a semaphore map (from semctl(..,IPC_INFO,..))",
    "pmid": 251679744,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_semid",
    "text-oneline": "maximum number of semaphore identifiers (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of semaphore identifiers (from semctl(..,IPC_INFO,..))",
    "pmid": 251679745,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_sem",
    "text-oneline": "maximum number of semaphores in system (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of semaphores in system (from semctl(..,IPC_INFO,..))",
    "pmid": 251679746,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.num_undo",
    "text-oneline": "number of undo structures in system (from semctl(..,IPC_INFO,..))",
    "text-help": "number of undo structures in system (from semctl(..,IPC_INFO,..))",
    "pmid": 251679747,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_perid",
    "text-oneline": "maximum number of semaphores per identifier (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of semaphores per identifier (from semctl(..,IPC_INFO,..))",
    "pmid": 251679748,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_ops",
    "text-oneline": "maximum number of operations per semop call (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of operations per semop call (from semctl(..,IPC_INFO,..))",
    "pmid": 251679749,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_undoent",
    "text-oneline": "maximum number of undo entries per process (from semctl(..,IPC_INFO,..))",
    "text-help": "maximum number of undo entries per process (from semctl(..,IPC_INFO,..))",
    "pmid": 251679750,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.sz_semundo",
    "text-oneline": "size of struct sem_undo (from semctl(..,IPC_INFO,..))",
    "text-help": "size of struct sem_undo (from semctl(..,IPC_INFO,..))",
    "pmid": 251679751,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_semval",
    "text-oneline": "semaphore maximum value (from semctl(..,IPC_INFO,..))",
    "text-help": "semaphore maximum value (from semctl(..,IPC_INFO,..))",
    "pmid": 251679752,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.max_exit",
    "text-oneline": "adjust on exit maximum value (from semctl(..,IPC_INFO,..))",
    "text-help": "adjust on exit maximum value (from semctl(..,IPC_INFO,..))",
    "pmid": 251679753,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.used_sem",
    "text-oneline": "number of semaphore sets currently on the system (from semctl(..,SEM_INFO,..))",
    "text-help": "number of semaphore sets currently on the system (from semctl(..,SEM_INFO,..))",
    "pmid": 251720704,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.tot_sem",
    "text-oneline": "number of semaphores in all sets on the system (from semctl(..,SEM_INFO,..))",
    "text-help": "number of semaphores in all sets on the system (from semctl(..,SEM_INFO,..))",
    "pmid": 251720705,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.key",
    "text-oneline": "key of these semaphore (from msgctl(..,SEM_STAT,..))",
    "text-help": "key of these semaphore (from msgctl(..,SEM_STAT,..))",
    "pmid": 251725824,
    "indom": 251658270,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.sem.owner",
    "text-oneline": "username of owner (from msgctl(..,SEM_STAT,..))",
    "text-help": "username of owner (from msgctl(..,SEM_STAT,..))",
    "pmid": 251725825,
    "indom": 251658270,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.sem.perms",
    "text-oneline": "access permissions (from msgctl(..,SEM_STAT,..))",
    "text-help": "access permissions (from msgctl(..,SEM_STAT,..))",
    "pmid": 251725826,
    "indom": 251658270,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.sem.nsems",
    "text-oneline": "number of semaphore (from semctl(..,SEM_STAT,..))",
    "text-help": "number of semaphore (from semctl(..,SEM_STAT,..))",
    "pmid": 251725827,
    "indom": 251658270,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.sz_pool",
    "text-oneline": "size of message pool in kilobytes (from msgctl(..,IPC_INFO,..))",
    "text-help": "size of message pool in kilobytes (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680768,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "ipc.msg.mapent",
    "text-oneline": "number of entries in a message map (from msgctl(..,IPC_INFO,..))",
    "text-help": "number of entries in a message map (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680769,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.max_msgsz",
    "text-oneline": "maximum size of a message in bytes (from msgctl(..,IPC_INFO,..))",
    "text-help": "maximum size of a message in bytes (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680770,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.max_defmsgq",
    "text-oneline": "default maximum size of a message queue (from msgctl(..,IPC_INFO,..))",
    "text-help": "default maximum size of a message queue (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680771,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.max_msgqid",
    "text-oneline": "maximum number of message queue identifiers (from msgctl(..,IPC_INFO,..))",
    "text-help": "maximum number of message queue identifiers (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680772,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.max_msgseg",
    "text-oneline": "message segment size (from msgctl(..,IPC_INFO,..))",
    "text-help": "message segment size (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680773,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.num_smsghdr",
    "text-oneline": "number of system message headers (from msgctl(..,IPC_INFO,..))",
    "text-help": "number of system message headers (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680774,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.max_seg",
    "text-oneline": "maximum number of message segments (from msgctl(..,IPC_INFO,..))",
    "text-help": "maximum number of message segments (from msgctl(..,IPC_INFO,..))",
    "pmid": 251680775,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.used_queues",
    "text-oneline": "number of message queues that currently exist (from msgctl(..,MSG_INFO,..))",
    "text-help": "number of message queues that currently exist (from msgctl(..,MSG_INFO,..))",
    "pmid": 251721728,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.tot_msg",
    "text-oneline": "total number of messages in all queues (from msgctl(..,MSG_INFO,..))",
    "text-help": "total number of messages in all queues (from msgctl(..,MSG_INFO,..))",
    "pmid": 251721729,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.tot_bytes",
    "text-oneline": "number of bytes in all messages in all queues (from msgctl(..,MSG_INFO,..))",
    "text-help": "number of bytes in all messages in all queues (from msgctl(..,MSG_INFO,..))",
    "pmid": 251721730,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.msg.key",
    "text-oneline": "name of these messages slot (from msgctl(..,MSG_STAT,..))",
    "text-help": "name of these messages slot (from msgctl(..,MSG_STAT,..))",
    "pmid": 251724800,
    "indom": 251658269,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.msg.owner",
    "text-oneline": "username of owner (from msgctl(..,MSG_STAT,..))",
    "text-help": "username of owner (from msgctl(..,MSG_STAT,..))",
    "pmid": 251724801,
    "indom": 251658269,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.msg.perms",
    "text-oneline": "access permissions (from msgctl(..,MSG_STAT,..))",
    "text-help": "access permissions (from msgctl(..,MSG_STAT,..))",
    "pmid": 251724802,
    "indom": 251658269,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.msgsz",
    "text-oneline": "used size in bytes (from msgctl(..,MSG_STAT,..))",
    "text-help": "used size in bytes (from msgctl(..,MSG_STAT,..))",
    "pmid": 251724803,
    "indom": 251658269,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.msg.messages",
    "text-oneline": "number of messages currently queued (from msgctl(..,MSG_STAT,..))",
    "text-help": "number of messages currently queued (from msgctl(..,MSG_STAT,..))",
    "pmid": 251724804,
    "indom": 251658269,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.msg.last_send_pid",
    "text-oneline": "last process to send on each message queue",
    "text-help": "last process to send on each message queue",
    "pmid": 251724805,
    "indom": 251658269,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.msg.last_recv_pid",
    "text-oneline": "last process to recv on each message queue",
    "text-help": "last process to recv on each message queue",
    "pmid": 251724806,
    "indom": 251658269,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.max_segsz",
    "text-oneline": "maximum shared segment size in bytes (from shmctl(..,IPC_INFO,..))",
    "text-help": "maximum shared segment size in bytes (from shmctl(..,IPC_INFO,..))",
    "pmid": 251681792,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.min_segsz",
    "text-oneline": "minimum shared segment size in bytes (from shmctl(..,IPC_INFO,..))",
    "text-help": "minimum shared segment size in bytes (from shmctl(..,IPC_INFO,..))",
    "pmid": 251681793,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.max_seg",
    "text-oneline": "maximum number of shared segments in system (from shmctl(..,IPC_INFO,..))",
    "text-help": "maximum number of shared segments in system (from shmctl(..,IPC_INFO,..))",
    "pmid": 251681794,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.max_segproc",
    "text-oneline": "maximum number of shared segments per process (from shmctl(..,IPC_INFO,..))",
    "text-help": "maximum number of shared segments per process (from shmctl(..,IPC_INFO,..))",
    "pmid": 251681795,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.max_shmsys",
    "text-oneline": "maximum amount of shared memory in system in pages (from shmctl(..,IPC_INFO,..))",
    "text-help": "maximum amount of shared memory in system in pages (from shmctl(..,IPC_INFO,..))",
    "pmid": 251681796,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.tot",
    "text-oneline": "total number of shared memory pages (from shmctl(..,SHM_INFO,..))",
    "text-help": "total number of shared memory pages (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715584,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.rss",
    "text-oneline": "number of resident shared memory pages (from shmctl(..,SHM_INFO,..))",
    "text-help": "number of resident shared memory pages (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715585,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.swp",
    "text-oneline": "number of swapped shared memory pages (from shmctl(..,SHM_INFO,..))",
    "text-help": "number of swapped shared memory pages (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715586,
    "sem": "instant",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.used_ids",
    "text-oneline": "number of currently existing segments (from shmctl(..,SHM_INFO,..))",
    "text-help": "number of currently existing segments (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715587,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.swap_attempts",
    "text-oneline": "number of swap attempts (from shmctl(..,SHM_INFO,..))",
    "text-help": "number of swap attempts (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715588,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.swap_successes",
    "text-oneline": "number of swap successes (from shmctl(..,SHM_INFO,..))",
    "text-help": "number of swap successes (from shmctl(..,SHM_INFO,..))",
    "pmid": 251715589,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.key",
    "text-oneline": "Key supplied to shmget (from shmctl(.., SHM_STAT, ..))",
    "text-help": "Key supplied to shmget (from shmctl(.., SHM_STAT, ..))",
    "pmid": 251723776,
    "indom": 251658268,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.shm.owner",
    "text-oneline": "share memory segment owner (rom shmctl(.., SHM_STAT, ..))",
    "text-help": "share memory segment owner (rom shmctl(.., SHM_STAT, ..))",
    "pmid": 251723777,
    "indom": 251658268,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.shm.perms",
    "text-oneline": "operation perms (from shmctl(.., SHM_STAT, ..))",
    "text-help": "operation perms (from shmctl(.., SHM_STAT, ..))",
    "pmid": 251723778,
    "indom": 251658268,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.segsz",
    "text-oneline": "size of segment (bytes) (from shmctl(.., SHM_STAT, ..))",
    "text-help": "size of segment (bytes) (from shmctl(.., SHM_STAT, ..))",
    "pmid": 251723779,
    "indom": 251658268,
    "sem": "discrete",
    "units": "byte",
    "type": "U32"
  },
  {
    "name": "ipc.shm.nattch",
    "text-oneline": "no. of current attaches (from shmctl(.., SHM_STAT, ..))",
    "text-help": "no. of current attaches (from shmctl(.., SHM_STAT, ..))",
    "pmid": 251723780,
    "indom": 251658268,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.status",
    "text-oneline": "share memory segment status (from shmctl(.., SHM_STAT, ..))",
    "text-help": "The string value may contain the space-separated values \"dest\" (a shared memory\nsegment marked for destruction on last detach) and \"locked\" or the empty string.",
    "pmid": 251723781,
    "indom": 251658268,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "ipc.shm.creator_pid",
    "text-oneline": "process creating each shared memory segment",
    "text-help": "process creating each shared memory segment",
    "pmid": 251723782,
    "indom": 251658268,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "ipc.shm.last_access_pid",
    "text-oneline": "process last accessing each shared memory segment",
    "text-help": "process last accessing each shared memory segment",
    "pmid": 251723783,
    "indom": 251658268,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.files.count",
    "text-oneline": "number of in-use file structures",
    "text-help": "number of in-use file structures",
    "pmid": 251685888,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.files.free",
    "text-oneline": "number of available file structures",
    "text-help": "number of available file structures",
    "pmid": 251685889,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.files.max",
    "text-oneline": "hard maximum on number of file structures",
    "text-help": "hard maximum on number of file structures",
    "pmid": 251685890,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.inodes.count",
    "text-oneline": "number of in-use inode structures",
    "text-help": "number of in-use inode structures",
    "pmid": 251685891,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.inodes.free",
    "text-oneline": "number of available inode structures",
    "text-help": "number of available inode structures",
    "pmid": 251685892,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.dentry.count",
    "text-oneline": "number of in-use directory entry structures",
    "text-help": "number of in-use directory entry structures",
    "pmid": 251685893,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.dentry.free",
    "text-oneline": "number of available directory entry structures",
    "text-help": "number of available directory entry structures",
    "pmid": 251685894,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.aio.count",
    "text-oneline": "number of in-use asynchronous IO structures",
    "text-help": "number of in-use asynchronous IO structures",
    "pmid": 251685895,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.aio.max",
    "text-oneline": "hard maximum on number of asynchronous IO structures",
    "text-help": "hard maximum on number of asynchronous IO structures",
    "pmid": 251685896,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "vfs.locks.posix.read",
    "text-oneline": "number of POSIX locks held for reading",
    "text-help": "number of POSIX locks held for reading",
    "pmid": 251735040,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.posix.write",
    "text-oneline": "number of POSIX locks held for writing",
    "text-help": "number of POSIX locks held for writing",
    "pmid": 251735041,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.posix.count",
    "text-oneline": "number of POSIX lock structures",
    "text-help": "number of POSIX lock structures",
    "pmid": 251735042,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.flock.read",
    "text-oneline": "number of advisory file locks held for reading",
    "text-help": "number of advisory file locks held for reading",
    "pmid": 251735043,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.flock.write",
    "text-oneline": "number of advisory file locks held for writing",
    "text-help": "number of advisory file locks held for writing",
    "pmid": 251735044,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.flock.count",
    "text-oneline": "number of advisory file lock structures",
    "text-help": "number of advisory file lock structures",
    "pmid": 251735045,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.lease.read",
    "text-oneline": "number of file leases held for reading",
    "text-help": "number of file leases held for reading",
    "pmid": 251735046,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.lease.write",
    "text-oneline": "number of file leases held for writing",
    "text-help": "number of file leases held for writing",
    "pmid": 251735047,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "vfs.locks.lease.count",
    "text-oneline": "number of file lease structures",
    "text-help": "number of file lease structures",
    "pmid": 251735048,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tmpfs.capacity",
    "text-oneline": "Total capacity of mounted tmpfs filesystem (Kbytes)",
    "text-help": "Total capacity of mounted tmpfs filesystem (Kbytes)",
    "pmid": 251693057,
    "indom": 251658258,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "tmpfs.used",
    "text-oneline": "Total space used on mounted tmpfs filesystem (Kbytes)",
    "text-help": "Total space used on mounted tmpfs filesystem (Kbytes)",
    "pmid": 251693058,
    "indom": 251658258,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "tmpfs.free",
    "text-oneline": "Total space free on mounted tmpfs filesystem (Kbytes)",
    "text-help": "Total space free on mounted tmpfs filesystem (Kbytes)",
    "pmid": 251693059,
    "indom": 251658258,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "tmpfs.maxfiles",
    "text-oneline": "Inodes capacity of mounted tmpfs filesystem",
    "text-help": "Inodes capacity of mounted tmpfs filesystem",
    "pmid": 251693060,
    "indom": 251658258,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tmpfs.usedfiles",
    "text-oneline": "Number of inodes allocated on mounted tmpfs filesystem",
    "text-help": "Number of inodes allocated on mounted tmpfs filesystem",
    "pmid": 251693061,
    "indom": 251658258,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tmpfs.freefiles",
    "text-oneline": "Number of unallocated inodes on mounted tmpfs filesystem",
    "text-help": "Number of unallocated inodes on mounted tmpfs filesystem",
    "pmid": 251693062,
    "indom": 251658258,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tmpfs.full",
    "text-oneline": "Percentage of tmpfs filesystem in use",
    "text-help": "Percentage of tmpfs filesystem in use",
    "pmid": 251693063,
    "indom": 251658258,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "sysfs.kernel.uevent_seqnum",
    "text-oneline": "counter of the number of uevents processed by the udev subsystem",
    "text-help": "counter of the number of uevents processed by the udev subsystem",
    "pmid": 251694080,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.in_flight",
    "text-oneline": "number of I/Os currently outstanding to this tape device",
    "text-help": "number of I/Os currently outstanding to this tape device",
    "pmid": 251730944,
    "indom": 251658274,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.io_ns",
    "text-oneline": "cummulative amount of time spent waiting for all I/O to complete to tape device",
    "text-help": "The amount of time spent waiting (in nanoseconds) for all I/O to complete\n(including read and write). This includes tape movement commands such as seeking\nbetween file or set marks and implicit tape movement such as when rewind on close\ntape devices are used.",
    "pmid": 251730945,
    "indom": 251658274,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "tape.dev.other_cnt",
    "text-oneline": "number of I/Os issued to the tape drive other than read or write commands",
    "text-help": "number of I/Os issued to the tape drive other than read or write commands",
    "pmid": 251730946,
    "indom": 251658274,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.read_byte_cnt",
    "text-oneline": "number of bytes read from the tape drive",
    "text-help": "number of bytes read from the tape drive",
    "pmid": 251730947,
    "indom": 251658274,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "tape.dev.read_cnt",
    "text-oneline": "number of read requests issued to the tape drive",
    "text-help": "number of read requests issued to the tape drive",
    "pmid": 251730948,
    "indom": 251658274,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.read_ns",
    "text-oneline": "cummulative amount of time spent waiting for read requests to complete",
    "text-help": "cummulative amount of time spent waiting for read requests to complete",
    "pmid": 251730949,
    "indom": 251658274,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "tape.dev.resid_cnt",
    "text-oneline": "count of read or write residual data, per tape device",
    "text-help": "Number of times during a read or write we found the residual amount to be non-zero.\nFor reads this means a program is issuing a read larger than the block size on tape.\nFor writes it means not all data made it to tape.",
    "pmid": 251730950,
    "indom": 251658274,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.write_byte_cnt",
    "text-oneline": "number of bytes written to the tape drive",
    "text-help": "number of bytes written to the tape drive",
    "pmid": 251730951,
    "indom": 251658274,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "tape.dev.write_cnt",
    "text-oneline": "number of write requests issued to the tape drive",
    "text-help": "number of write requests issued to the tape drive",
    "pmid": 251730952,
    "indom": 251658274,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "tape.dev.write_ns",
    "text-oneline": "cummulative amount of time spent waiting for write requests to complete",
    "text-help": "cummulative amount of time spent waiting for write requests to complete",
    "pmid": 251730953,
    "indom": 251658274,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "tty.serial.tx",
    "text-oneline": "Number of transmit interrupts for current serial line.",
    "text-help": "Number of transmit interrupts for current serial line.",
    "pmid": 251734016,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.rx",
    "text-oneline": "Number of receive interrupts for current serial line.",
    "text-help": "Number of receive interrupts for current serial line.",
    "pmid": 251734017,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.frame",
    "text-oneline": "Number of frame errors for current serial line.",
    "text-help": "Number of frame errors for current serial line.",
    "pmid": 251734018,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.parity",
    "text-oneline": "Number of parity errors for current serial line.",
    "text-help": "Number of parity errors for current serial line.",
    "pmid": 251734019,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.brk",
    "text-oneline": "Number of breaks for current serial line.",
    "text-help": "Number of breaks for current serial line.",
    "pmid": 251734020,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.overrun",
    "text-oneline": "Number of overrun errors for current serial line.",
    "text-help": "Number of overrun errors for current serial line.",
    "pmid": 251734021,
    "indom": 251658275,
    "sem": "counter",
    "units": "",
    "type": "U32"
  },
  {
    "name": "tty.serial.irq",
    "text-oneline": "IRQ number.",
    "text-help": "IRQ number.",
    "pmid": 251734022,
    "indom": 251658275,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "mmv.control.files",
    "text-oneline": "Memory mapped file count",
    "text-help": "Count of currently mapped and exported statistics files.\n",
    "pmid": 293601282,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "mmv.control.debug",
    "text-oneline": "Debug flag",
    "text-help": "See pmdbg(1).  pmstore into this metric to change the debug value.\n",
    "pmid": 293601281,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "mmv.control.reload",
    "text-oneline": "Control maps reloading",
    "text-help": "Writing anything other then 0 to this metric will result in\nre-reading directory and re-mapping files.\n",
    "pmid": 293601280,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.datasize",
    "text-oneline": "Space allocated for PMCD and DSO agents' data segment (K)",
    "text-help": "This metric returns the amount of memory in kilobytes allocated for the\ndata segment of PMCD and any DSO agents (PMDAs) that it has loaded.\n\nThis is handy for tracing memory utilization (and leaks) in DSOs during\ndevelopment.",
    "pmid": 8388609,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "pmcd.numagents",
    "text-oneline": "Number of agents (PMDAs) currently connected to PMCD",
    "text-help": "The number of agents (PMDAs) currently connected to PMCD.  This may differ\nfrom the number of agents configured in $PCP_PMCDCONF_PATH if agents have\nterminated and/or been timed-out by PMCD.",
    "pmid": 8388610,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.numclients",
    "text-oneline": "Number of clients currently connected to PMCD",
    "text-help": "The number of connections open to client programs retrieving information\nfrom PMCD.",
    "pmid": 8388611,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.timezone",
    "text-oneline": "local $TZ",
    "text-help": "Value for the $TZ environment variable where the PMCD is running.\nEnables determination of \"local\" time for timestamps returned via\nPMCD from a remote host.",
    "pmid": 8388613,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.simabi",
    "text-oneline": "Procedure call model and ABI version of this PMCD",
    "text-help": "SIM is the subprogram interface model (originally from the MIPS object\ncode formats), and ABI is the application binary interface.  Both\nrelate to the way the PMCD binary was compiled and linked.\n\nUsually DSO PMDAs must be compiled and linked in the same way before\nthey can be used with PMCD.\n\nOn some platforms this metric is not available.",
    "pmid": 8388614,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.version",
    "text-oneline": "PMCD version",
    "text-help": "PMCD version",
    "pmid": 8388615,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.services",
    "text-oneline": "running PCP services on the local host",
    "text-help": "A space-separated string representing all running PCP services with PID\nfiles in $PCP_RUN_DIR (such as pmcd itself, pmproxy and a few others).",
    "pmid": 8388624,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.openfds",
    "text-oneline": "highest PMCD file descriptor",
    "text-help": "The highest file descriptor index used by PMCD for a Client or PMDA\nconnection.",
    "pmid": 8388625,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.build",
    "text-oneline": "build version for installed PCP package",
    "text-help": "Minor part of the PCP build version numbering.  For example on Linux\nwith RPM packaging, if the PCP RPM version is pcp-2.5.99-20070323 then\npmcd.build returns the string \"20070323\".",
    "pmid": 8388628,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.hostname",
    "text-oneline": "local hostname",
    "text-help": "A reasonably unique identifier of the PMCD installation, for use\nby pmlogger or other tools to identify the source principal of\nthe data (as distinct from identifying the connection/protocol\nused to reach it).",
    "pmid": 8388629,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.sighups",
    "text-oneline": "count of SIGHUP signals pmcd has received",
    "text-help": "count of SIGHUP signals pmcd has received",
    "pmid": 8388630,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pid",
    "text-oneline": "PID for the current pmcd invocation",
    "text-help": "PID for the current pmcd invocation",
    "pmid": 8388631,
    "sem": "discrete",
    "units": "",
    "type": "U64"
  },
  {
    "name": "pmcd.seqnum",
    "text-oneline": "pmcd configuration sequence number",
    "text-help": "\nThe configuration sequence number starts at 1 when pmcd is started\nand is incremented by 1 each time a PMDA is started or restarted.\n\nSo all the while the value of pmcd.seqnum remains constant we can\nassert the data from all the PMDAs forms a continuous time series\nand in particular no counters or other metrics have been reset due\nto a PMDA start/restart.",
    "pmid": 8388632,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.labels",
    "text-oneline": "Context level metadata labels associated with all values",
    "text-help": "Additional end-user and PMCS metadata can be associated with performance\nmetrics via $PCP_SYSCONF_DIR/labels files.  This metric exports the user\ndefined labels that will be reported by pmGetContextLabels(3).  This set\ndoes not include labels automatically associated with every context such\nas the hostname, user and group identifier, container identifier, etc.",
    "pmid": 8388633,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.control.debug",
    "text-oneline": "Current value of PMCD debug flags",
    "text-help": "The current value of the PMCD debug flags.  This is a bit-wise OR of the\nflags described in the output of pmdbg -l.  The PMCD-specific flags are:\n\n    DBG_TRACE_APPL0       2048  Trace agent & client I/O and termination\n    DBG_TRACE_APPL1       4096  Trace host access control\n    DBG_TRACE_APPL2       8192  Trace config file scanner and parser\n\nIt is possible to store values into this metric, see the -ol options for\npmdbg(1) to help determine appropriate values for the debug flags.\n\nDiagnostic output is written to the PMCD log file (usually\n$PCP_LOG_DIR/pmcd/pmcd.log).",
    "pmid": 8388608,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.timeout",
    "text-oneline": "Timeout interval for slow/hung agents (PMDAs)",
    "text-help": "PDU exchanges with agents (PMDAs) managed by PMCD are subject to timeouts\nwhich detect and clean up slow or disfunctional agents.  This metric\nreturns the current timeout period in seconds being used for the agents.\nIf the value is zero, timeouts are not being used.  This corresponds to\nthe -t option described in the man page, pmcd(1).\n\nIt is possible to store a new timeout value into this metric.  Storing zero\nwill turn off timeouts.  Subsequent storing of a non-zero value will turn\non the timeouts again.",
    "pmid": 8388612,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.control.register",
    "text-oneline": "a vector of registers that may be set by users",
    "text-help": "A vector of 16 32-bit registers that are identified by the instance\nidentifiers 0 through 15.\n\nThe register contents are initially zero, but may be subsequently\nmodified to be an arbitrary value using pmStore(3) or pmstore(1).\n\nThe values are not used internally, but rather act as a repository into\nwhich operational information might be stored, and then exported to\nmodify the behavior of client programs, e.g. inhibit pmie(1) rule\nfiring, or trigger a status indicator.  In this way,\npmcd.control.register acts like a primitive bulletin board.\n\nExample use might be as follows\n    register[0]\ttelephone no. of person assigned to current system problem\n    register[1]\ttelephone no. of person assigned to current network problem\n    register[2]\tORACLE database is down\n    register[3]\tbackup in progress\n    register[4]\tshopping days to Christmas",
    "pmid": 8388616,
    "indom": 8388610,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.traceconn",
    "text-oneline": "control PMCD connection event tracing",
    "text-help": "Set to 1 to enable PMCD event tracing for all connection-related\nevents for clients and PMDAs.\n\nSet to 0 to disable PMCD connection event tracing.",
    "pmid": 8388617,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.tracepdu",
    "text-oneline": "control PMCD PDU event tracing",
    "text-help": "Set to 1 to enable PMCD event tracing for all PDUs sent and received\nby PMCD.\n\nSet to 0 to disable PMCD PDU event tracing.",
    "pmid": 8388618,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.tracenobuf",
    "text-oneline": "control buffering of PMCD event tracing",
    "text-help": "Set to 1 to enable unbuffered PMCD event tracing, where each event is\nreported as it happens.\n\nSet to 0 to enable buffering of PMCD event traces (this is the default),\nand event traces will only be dumped or reported when an error occurs or\na value is stored into the PCP metric pmcd.control.dumptrace.",
    "pmid": 8388622,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.tracebufs",
    "text-oneline": "number of buffers for PMCD event tracing",
    "text-help": "Defaults to 20.  May be changed dynamically.",
    "pmid": 8388619,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.dumptrace",
    "text-oneline": "force dump of PMCD event tracing buffers",
    "text-help": "Storing any value into this metric causes the PMCD event trace buffers to\nbe dumped to PMCD's log file.",
    "pmid": 8388620,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.dumpconn",
    "text-oneline": "force dump of PMCD client connections",
    "text-help": "Storing any value into this metric causes the details of the current PMCD\nclient connections to be dumped to PMCD's log file.",
    "pmid": 8388621,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.control.sighup",
    "text-oneline": "force PMCD reset via SIGHUP",
    "text-help": "Storing any value into this metric causes PMCD to be reset by sending\nitself a SIGHUP signal.\n\nOn reset (either by storing into pmcd.control.sighup or by sending PMCD a\nSIGHUP directly), PMCD will restart any failed PMDAs and reload the PMNS\nif it has been changed.",
    "pmid": 8388623,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.pdu_in.error",
    "text-oneline": "ERROR PDUs received by PMCD",
    "text-help": "Running total of BINARY mode ERROR PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389632,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.result",
    "text-oneline": "RESULT PDUs received by PMCD",
    "text-help": "Running total of BINARY mode RESULT PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389633,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.profile",
    "text-oneline": "PROFILE PDUs received by PMCD",
    "text-help": "Running total of BINARY mode PROFILE PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389634,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.fetch",
    "text-oneline": "FETCH PDUs received by PMCD",
    "text-help": "Running total of BINARY mode FETCH PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389635,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.desc_req",
    "text-oneline": "DESC_REQ PDUs received by PMCD",
    "text-help": "Running total of BINARY mode DESC_REQ PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389636,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.desc",
    "text-oneline": "DESC PDUs received by PMCD",
    "text-help": "Running total of BINARY mode DESC PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389637,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.instance_req",
    "text-oneline": "INSTANCE_REQ PDUs received by PMCD",
    "text-help": "Running total of BINARY mode INSTANCE_REQ PDUs received by the PMCD\nfrom clients and agents.",
    "pmid": 8389638,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.instance",
    "text-oneline": "INSTANCE PDUs received by PMCD",
    "text-help": "Running total of BINARY mode INSTANCE PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389639,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.text_req",
    "text-oneline": "TEXT_REQ PDUs received by PMCD",
    "text-help": "Running total of BINARY mode TEXT_REQ PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389640,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.text",
    "text-oneline": "TEXT PDUs received by PMCD",
    "text-help": "Running total of BINARY mode TEXT PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389641,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.control_req",
    "text-oneline": "CONTROL_REQ PDUs received by PMCD",
    "text-help": "Running total of BINARY mode CONTROL_REQ PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389642,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.creds",
    "text-oneline": "CREDS PDUs received by PMCD",
    "text-help": "Running total of BINARY mode CREDS PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389644,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.pmns_ids",
    "text-oneline": "PMNS_IDS PDUs received by PMCD",
    "text-help": "Running total of BINARY mode PMNS_IDS PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389645,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.pmns_names",
    "text-oneline": "PMNS_NAMES PDUs received by PMCD",
    "text-help": "Running total of BINARY mode PMNS_NAMES PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389646,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.pmns_child",
    "text-oneline": "PMNS_CHILD PDUs received by PMCD",
    "text-help": "Running total of BINARY mode PMNS_CHILD PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389647,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.total",
    "text-oneline": "Total PDUs received by PMCD",
    "text-help": "Running total of all BINARY mode PDUs received by the PMCD from clients\nand agents.",
    "pmid": 8389648,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.pmns_traverse",
    "text-oneline": "PMNS_TRAVERSE PDUs received by PMCD",
    "text-help": "Running total of BINARY mode PMNS_TRAVERSE PDUs received by the PMCD from\nclients and agents.",
    "pmid": 8389649,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.auth",
    "text-oneline": "AUTH PDUs received by PMCD",
    "text-help": "Running total of BINARY mode AUTH PDUs received by PMCD from\nclients and agents.  These PDUs are used for authentication.",
    "pmid": 8389650,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.label_req",
    "text-oneline": "LABEL_REQ PDUs received by PMCD",
    "text-help": "Running total of BINARY mode LABEL_REQ PDUs received by PMCD from\nclients and agents.  These PDUs are used to request metric metadata\nlabels.",
    "pmid": 8389651,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_in.label",
    "text-oneline": "LABEL PDUs received by PMCD",
    "text-help": "Running total of BINARY mode LABEL PDUs received by PMCD from\nclients and agents.  These PDUs are used to send custom metric\nmetadata in the form of name:value pairs (labels).",
    "pmid": 8389652,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.error",
    "text-oneline": "ERROR PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode ERROR PDUs sent by the PMCD to clients and\nagents.",
    "pmid": 8390656,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.result",
    "text-oneline": "RESULT PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode RESULT PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390657,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.profile",
    "text-oneline": "PROFILE PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode PROFILE PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390658,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.fetch",
    "text-oneline": "FETCH PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode FETCH PDUs sent by the PMCD to clients and\nagents.",
    "pmid": 8390659,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.desc_req",
    "text-oneline": "DESC_REQ PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode DESC_REQ PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390660,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.desc",
    "text-oneline": "DESC PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode DESC PDUs sent by the PMCD to clients and\nagents.",
    "pmid": 8390661,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.instance_req",
    "text-oneline": "INSTANCE_REQ PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode INSTANCE_REQ PDUs sent by the PMCD to\nclients and agents.",
    "pmid": 8390662,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.instance",
    "text-oneline": "INSTANCE PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode INSTANCE PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390663,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.text_req",
    "text-oneline": "TEXT_REQ PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode TEXT_REQ PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390664,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.text",
    "text-oneline": "TEXT PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode TEXT PDUs sent by the PMCD to clients and\nagents.",
    "pmid": 8390665,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.control_req",
    "text-oneline": "CONTROL_REQ PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode CONTROL_REQ PDUs sent by the PMCD to\nclients and agents.",
    "pmid": 8390666,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.creds",
    "text-oneline": "CREDS PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode CREDS PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390668,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.pmns_ids",
    "text-oneline": "PMNS_IDS PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode PMNS_IDS PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390669,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.pmns_names",
    "text-oneline": "PMNS_NAMES PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode PMNS_NAMES PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390670,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.pmns_child",
    "text-oneline": "PMNS_CHILD PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode PMNS_CHILD PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390671,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.total",
    "text-oneline": "Total PDUs sent by PMCD",
    "text-help": "Running total of all BINARY mode PDUs sent by the PMCD to clients and\nagents.",
    "pmid": 8390672,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.pmns_traverse",
    "text-oneline": "PMNS_TRAVERSE PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode PMNS_TRAVERSE PDUs sent by the PMCD to clients\nand agents.",
    "pmid": 8390673,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.auth",
    "text-oneline": "AUTH PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode AUTH PDUs sent by the PMCD to clients\nand agents.  These PDUs are used for authentication.",
    "pmid": 8390674,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.label_req",
    "text-oneline": "LABEL_REQ PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode LABEL_REQ PDUs sent by the PMCD to clients\nand agents.  These are used to request metadata labels (name:value pairs).",
    "pmid": 8390675,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pdu_out.label",
    "text-oneline": "LABEL PDUs sent by PMCD",
    "text-help": "Running total of BINARY mode LABEL PDUs sent by the PMCD to clients\nand agents.  These are used to send metadata labels (name:value pairs).",
    "pmid": 8390676,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.agent.type",
    "text-oneline": "PMDA type",
    "text-help": "From $PCP_PMCDCONF_PATH, this metric encodes the PMDA type as follows:\n\t(x << 1) | y\nwhere \"x\" is the IPC type between PMCD and the PMDA, i.e. 0 for DSO, 1\nfor socket or 2 for pipe, and \"y\" is the message passing style, i.e.\n0 for binary or 1 for ASCII.",
    "pmid": 8392704,
    "indom": 8388611,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.agent.status",
    "text-oneline": "PMDA status",
    "text-help": "This metric encodes the current status of each PMDA.  The default value\nis 0 if the PMDA is active.\n\nOther values encode various degrees of PMDA difficulty in three bit fields\n(bit 0 is the low-order bit) as follows:\n\nbits 7..0\n    1   the PMDA is connected, but not yet \"ready\" to accept requests\n        from the PMDA\n    2   the PMDA has exited of its own accord\n    4   some error prevented the PMDA being started\n    8   PMCD stopped communication with the PMDA due to a protocol or\n        timeout error\n\nbits 15..8\n        the exit() status from the PMDA\n\nbits 23..16\n        the number of the signal that terminated the PMDA",
    "pmid": 8392705,
    "indom": 8388611,
    "sem": "discrete",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmcd.agent.fenced",
    "text-oneline": "PMDA status of pmcd fetch operation fencing",
    "text-help": "A value of zero indicates not enabled, one indicates that operations\nrequiring fetch-level access controls are currently being denied and\nPM_ERR_PMDAFENCED error code returned, for each PMDA.\n\nThe fence status is initially zero for all PMDAs, but may be subsequently\nmodified to start and stop fencing using pmStore(3) or pmstore(1).  Note:\nonly root may store to this metric and the PMCD PMDA cannot be fenced (it\nwill be silently ignored if attempted).",
    "pmid": 8392706,
    "indom": 8388611,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.pmlogger.host",
    "text-oneline": "host where active pmlogger is running",
    "text-help": "The fully qualified domain name of the host on which a pmlogger\ninstance is running.\n\nThe instance names are process IDs of the active pmloggers.  The\nprimary pmlogger has an extra instance with the instance name \"primary\"\nand an instance ID of zero (in addition to its normal process ID\ninstance).",
    "pmid": 8391683,
    "indom": 8388609,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmlogger.port",
    "text-oneline": "control port for active pmlogger",
    "text-help": "Each pmlogger instance has a port for receiving log control\ninformation.  This metric is a list of the active pmlogger control\nports on the same machine as this PMCD (i.e. the host identified in the\ncorresponding pmcd.pmlogger.host metric).\n\nThe instance names are process IDs of the active pmloggers.  The\nprimary pmlogger has an extra instance with the instance name \"primary\"\nand an instance ID of zero (in addition to its normal process ID\ninstance).",
    "pmid": 8391680,
    "indom": 8388609,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.pmlogger.archive",
    "text-oneline": "full pathname to archive basename for active pmlogger",
    "text-help": "The full pathname through the filesystem on the corresponding host\n(pmcd.pmlogger.host) that is the base name for the archive log files.\n\nThe instance names are process IDs of the active pmloggers.  The\nprimary pmlogger has an extra instance with the instance name \"primary\"\nand an instance ID of zero (in addition to its normal process ID\ninstance).",
    "pmid": 8391682,
    "indom": 8388609,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmlogger.pmcd_host",
    "text-oneline": "host from which active pmlogger is fetching metrics",
    "text-help": "The fully qualified domain name of the host from which a pmlogger\ninstance is fetching metrics to be archived.\n\nThe instance names are process IDs of the active pmloggers.  The\nprimary pmlogger has an extra instance with the instance name \"primary\"\nand an instance ID of zero (in addition to its normal process ID\ninstance).",
    "pmid": 8391681,
    "indom": 8388609,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmie.configfile",
    "text-oneline": "configuration file name",
    "text-help": "The full path in the filesystem to the configuration file containing the\nrules being evaluated by each pmie instance.\n\nIf the configuration file was supplied on the standard input, then this\nmetric will have the value \"<stdin>\".  If multiple configuration files were\ngiven to pmie, then the value of this metric will be the first configuration\nfile specified.",
    "pmid": 8393728,
    "indom": 8388612,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmie.logfile",
    "text-oneline": "filename of pmie instance event log",
    "text-help": "The file to which each instance of pmie is writting events.  No two pmie\ninstances can share the same log file.  If no logfile was specified when\npmie was started, this metrics has the value \"<none>\".  All daemon pmie\ninstances started through pmie_check(1) must have an associated log file.",
    "pmid": 8393729,
    "indom": 8388612,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmie.pmcd_host",
    "text-oneline": "default hostname for pmie instance",
    "text-help": "The default host from which pmie is fetching metrics.  This is either the\nhostname given to pmie on the command line or the local host.  Note that this\ndoes not consider host names specified in the pmie configuration file (these\nare considered non-default and can be more than one per pmie instance).\nAll daemon pmie instances started through pmie_check(1) will have their\ndefault host passed in on their command line.",
    "pmid": 8393730,
    "indom": 8388612,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.pmie.numrules",
    "text-oneline": "number of rules being evaluated",
    "text-help": "The total number of rules being evaluated by each pmie process.",
    "pmid": 8393731,
    "indom": 8388612,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.pmie.actions",
    "text-oneline": "count of rules evaluating to true",
    "text-help": "A cumulative count of the evaluated pmie rules which have evaluated to true.\n\nThis value is incremented once each time an action is executed.  This value\nwill always be less than or equal to pmcd.pmie.eval.true because predicates\nwhich have evaluated to true may be suppressed in the action part of the\npmie rule, in which case this counter will not be incremented.",
    "pmid": 8393732,
    "indom": 8388612,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pmie.eval.true",
    "text-oneline": "count of pmie predicates evaluated to true",
    "text-help": "The predicate part of a pmie rule can be said to evaluate to either true,\nfalse, or not known.  This metric is a cumulative count of the number of\nrules which have evaluated to true for each pmie instance.",
    "pmid": 8393733,
    "indom": 8388612,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pmie.eval.false",
    "text-oneline": "count of pmie predicates evaluated to false",
    "text-help": "The predicate part of a pmie rule can be said to evaluate to either true,\nfalse, or not known.  This metric is a cumulative count of the number of\nrules which have evaluated to false for each pmie instance.",
    "pmid": 8393734,
    "indom": 8388612,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pmie.eval.unknown",
    "text-oneline": "count of pmie predicates not evaluated",
    "text-help": "The predicate part of a pmie rule can be said to evaluate to either true,\nfalse, or not known.  This metric is a cumulative count of the number of\nrules which have not been successfully evaluated.  This could be due to not\nyet having sufficient values to evaluate the rule, or a metric fetch may\nhave been unsuccessful in retrieving current values for metrics required\nfor evaluation of the rule.",
    "pmid": 8393735,
    "indom": 8388612,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.pmie.eval.expected",
    "text-oneline": "expected rate of rule evaluations",
    "text-help": "This is the expected rate of evaluation of pmie rules.  The value is\ncalculated once when pmie starts, and is the number of pmie rules divided\nby the average time interval over which they are to be evaluated.",
    "pmid": 8393736,
    "indom": 8388612,
    "sem": "discrete",
    "units": "count / sec",
    "type": "FLOAT"
  },
  {
    "name": "pmcd.pmie.eval.actual",
    "text-oneline": "count of actual rule evaluations",
    "text-help": "A cumulative count of the pmie rules which have been evaluated.\n\nThis value is incremented once for each evaluation of each rule.",
    "pmid": 8393737,
    "indom": 8388612,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "pmcd.buf.alloc",
    "text-oneline": "Allocated buffers in internal memory pools",
    "text-help": "This metric returns the number of allocated buffers for the various buffer\npools used by pmcd.\n\nThis is handy for tracing memory utilization (and leaks) in DSOs during\ndevelopment.",
    "pmid": 8388626,
    "indom": 8388613,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "pmcd.buf.free",
    "text-oneline": "Free buffers in internal memory pools",
    "text-help": "This metric returns the number of free buffers for the various buffer\npools used by pmcd.\n\nThis is handy for tracing memory utilization (and leaks) in DSOs during\ndevelopment.",
    "pmid": 8388627,
    "indom": 8388613,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "pmcd.client.whoami",
    "text-oneline": "optional identification information for clients of pmcd",
    "text-help": "This metric is defined over an instance domain containing one entry\nper active client of pmcd.  The instance number is a sequence number\nfor each client (restarts at 0 each time pmcd is restarted).  The value\nof the metric by default is the IP address of the client.\n\nClients can optionally use pmStore to modify their own \"whoami\" string\nto provide more useful information about the client.",
    "pmid": 8394752,
    "indom": 8388614,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.client.start_date",
    "text-oneline": "date and time client connected to pmcd",
    "text-help": "The date and time in ctime(2) format on which the client connected\nto pmcd.",
    "pmid": 8394753,
    "indom": 8388614,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.client.container",
    "text-oneline": "name of container (if any) being analysed",
    "text-help": "The name of the container (if any) associated with this context at\nthe time of the fetch request.  The container name can be set when\nestablishing a PMAPI context, or by storing into this metric using\nthe pmStore interface.",
    "pmid": 8394754,
    "indom": 8388614,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "pmcd.cputime.total",
    "text-oneline": "CPU time used by pmcd and DSO PMDAs",
    "text-help": "Sum of user and system time since pmcd started.",
    "pmid": 8395776,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "pmcd.cputime.per_pdu_in",
    "text-oneline": "average CPU time per PDU received by pmcd",
    "text-help": "When first requested it is the average since pmcd started, so\npmcd.cputime.total divided by pmcd.pdu_in.total.\n\nSubsequent fetches by a PMAPI client will return the average CPU\ntime per PDU received by pmcd (for all clients) since the last time\nthe PMAPI client fetched this metric.",
    "pmid": 8395777,
    "sem": "instant",
    "units": "microsec / count",
    "type": "DOUBLE"
  },
  {
    "name": "pmcd.feature.secure",
    "text-oneline": "status of secure_sockets protocol feature in pmcd",
    "text-help": "A value of zero indicates no support, one indicates actively available\n(including configuration and validity of the server side certificates).",
    "pmid": 8396800,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.compress",
    "text-oneline": "status of protocol compression feature in pmcd",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396801,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.ipv6",
    "text-oneline": "status of Internet Protocol Version 6 support in pmcd",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396802,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.authentication",
    "text-oneline": "status of per-user authentication support",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396803,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.creds_required",
    "text-oneline": "status of required credentials support",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396804,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.unix_domain_sockets",
    "text-oneline": "status of unix domain socket support",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396805,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.service_discovery",
    "text-oneline": "status of service advertising and discovery",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396806,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.containers",
    "text-oneline": "status of support for containers in pmcd",
    "text-help": "A value of zero indicates no support, one indicates actively available.",
    "pmid": 8396807,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.local",
    "text-oneline": "status of localhost-only mode of operation in pmcd",
    "text-help": "A value of zero indicates not enabled, one indicates the localhost-only\nmode of operation is active.",
    "pmid": 8396808,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmcd.feature.client_cert_required",
    "text-oneline": "status of required client certificate",
    "text-help": "A value of zero indicates not required, one indicates required.",
    "pmid": 8396809,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "pmproxy.control.files",
    "text-oneline": "Memory mapped file count",
    "text-help": "Count of currently mapped and exported statistics files.\n",
    "pmid": 16777218,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmproxy.control.debug",
    "text-oneline": "Debug flag",
    "text-help": "See pmdbg(1).  pmstore into this metric to change the debug value.\n",
    "pmid": 16777217,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "pmproxy.control.reload",
    "text-oneline": "Control maps reloading",
    "text-help": "Writing anything other then 0 to this metric will result in\nre-reading directory and re-mapping files.\n",
    "pmid": 16777216,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "cgroup.subsys.hierarchy",
    "text-oneline": "subsystem hierarchy from /proc/cgroups",
    "text-help": "subsystem hierarchy from /proc/cgroups",
    "pmid": 12620800,
    "indom": 12582949,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "cgroup.subsys.count",
    "text-oneline": "count of known subsystems in /proc/cgroups",
    "text-help": "count of known subsystems in /proc/cgroups",
    "pmid": 12620801,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "cgroup.subsys.num_cgroups",
    "text-oneline": "number of cgroups for each subsystem",
    "text-help": "number of cgroups for each subsystem",
    "pmid": 12620802,
    "indom": 12582949,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "cgroup.subsys.enabled",
    "text-oneline": "state of cgroups subsystems in the kernel",
    "text-help": "state of cgroups subsystems in the kernel",
    "pmid": 12620803,
    "indom": 12582949,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "cgroup.mounts.subsys",
    "text-oneline": "mount points for each cgroup subsystem",
    "text-help": "mount points for each cgroup subsystem",
    "pmid": 12621824,
    "indom": 12582950,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.mounts.count",
    "text-oneline": "count of cgroup filesystem mount points",
    "text-help": "count of cgroup filesystem mount points",
    "pmid": 12621825,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "cgroup.cpuset.cpus",
    "text-oneline": "CPUs assigned to each individual cgroup",
    "text-help": "CPUs assigned to each individual cgroup",
    "pmid": 12622848,
    "indom": 12582932,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.cpuset.mems",
    "text-oneline": "Memory nodes assigned to each individual cgroup",
    "text-help": "Memory nodes assigned to each individual cgroup",
    "pmid": 12622849,
    "indom": 12582932,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.cpuset.id.container",
    "text-oneline": "Each cpuset cgroups container based on heuristics",
    "text-help": "Each cpuset cgroups container based on heuristics",
    "pmid": 12622850,
    "indom": 12582932,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.cpuacct.usage",
    "text-oneline": "CPU time consumed by processes in each cgroup",
    "text-help": "CPU time consumed by processes in each cgroup",
    "pmid": 12624898,
    "indom": 12582933,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpuacct.usage_percpu",
    "text-oneline": "Per-CPU time consumed by processes in each cgroup",
    "text-help": "Per-CPU time consumed by processes in each cgroup",
    "pmid": 12624899,
    "indom": 12582934,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpuacct.stat.user",
    "text-oneline": "Time spent by tasks of the cgroup in user mode",
    "text-help": "Time spent by tasks of the cgroup in user mode",
    "pmid": 12624896,
    "indom": 12582933,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpuacct.stat.system",
    "text-oneline": "Time spent by tasks of the cgroup in kernel mode",
    "text-help": "Time spent by tasks of the cgroup in kernel mode",
    "pmid": 12624897,
    "indom": 12582933,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpuacct.id.container",
    "text-oneline": "Each cpuacct cgroups container based on heuristics",
    "text-help": "Each cpuacct cgroups container based on heuristics",
    "pmid": 12624900,
    "indom": 12582933,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.cpusched.shares",
    "text-oneline": "Processor scheduler cgroup shares",
    "text-help": "Scheduler fairness CPU time division for each cgroup - details in\nDocumentation/scheduler/sched-design-CFS.txt in the kernel source.",
    "pmid": 12626944,
    "indom": 12582935,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "cgroup.cpusched.periods",
    "text-oneline": "Number of CFS elapsed enforcement intervals",
    "text-help": "Scheduler group bandwidth enforcement interfaces that have elapsed,\nrefer to Documentation/scheduler/sched-bwc.txt in the kernel source.",
    "pmid": 12626945,
    "indom": 12582935,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "cgroup.cpusched.throttled",
    "text-oneline": "Number of times CFS group was throttled/limited",
    "text-help": "Scheduler group bandwidth throttle/limit count - further discussion\nin Documentation/scheduler/sched-bwc.txt in the kernel source.",
    "pmid": 12626946,
    "indom": 12582935,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "cgroup.cpusched.throttled_time",
    "text-oneline": "Total time CFS group was throttled/limited",
    "text-help": "The total time duration (in nanoseconds) for which entities of the\ngroup have been throttled by the CFS scheduler - refer to discussion\nin Documentation/scheduler/sched-bwc.txt in the kernel source.",
    "pmid": 12626947,
    "indom": 12582935,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpusched.cfs_period",
    "text-oneline": "The length of a CFS period (usec)",
    "text-help": "The bandwidth allowed for a CFS group is specified using a quota and period.\nWithin each given \"period\" (usec), a group is allowed to consume only up to\n\"quota\" usec of CPU time.  When the CPU bandwidth consumption of a group\nexceeds this limit (for that period), the tasks belonging to its hierarchy\nwill be throttled and are not allowed to run again until the next period.\nFurther discussion in Documentation/scheduler/sched-bwc.txt in the kernel\nsources.",
    "pmid": 12626948,
    "indom": 12582935,
    "sem": "instant",
    "units": "microsec",
    "type": "U64"
  },
  {
    "name": "cgroup.cpusched.cfs_quota",
    "text-oneline": "Total available runtime within a period (usec)",
    "text-help": "The bandwidth allowed for a CFS group is specified using a quota and period.\nWithin each given \"period\" (usec), a group is allowed to consume only up to\n\"quota\" usec of CPU time.  When the CPU bandwidth consumption of a group\nexceeds this limit (for that period), the tasks belonging to its hierarchy\nwill be throttled and are not allowed to run again until the next period.\n\nA value of -1 indicates that the group does not have bandwidth restriction\nin place.  Refer to discussion in Documentation/scheduler/sched-bwc.txt in\nthe kernel source.",
    "pmid": 12626949,
    "indom": 12582935,
    "sem": "instant",
    "units": "microsec",
    "type": "64"
  },
  {
    "name": "cgroup.cpusched.id.container",
    "text-oneline": "Each cpusched cgroups container based on heuristics",
    "text-help": "Each cpusched cgroups container based on heuristics",
    "pmid": 12626950,
    "indom": 12582935,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.memory.usage",
    "text-oneline": "Current physical memory accounted to each cgroup",
    "text-help": "Current physical memory accounted to each cgroup",
    "pmid": 12629072,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.limit",
    "text-oneline": "Maximum memory that can be utilized by each cgroup",
    "text-help": "Maximum memory that can be utilized by each cgroup",
    "pmid": 12629073,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.failcnt",
    "text-oneline": "Count of failures to allocate memory due to cgroup limit",
    "text-help": "Count of failures to allocate memory due to cgroup limit",
    "pmid": 12629074,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.cache",
    "text-oneline": "Number of bytes of page cache memory",
    "text-help": "Number of bytes of page cache memory",
    "pmid": 12628992,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.rss",
    "text-oneline": "Anonymous and swap memory (incl transparent hugepages)",
    "text-help": "Anonymous and swap memory (incl transparent hugepages)",
    "pmid": 12628993,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.rss_huge",
    "text-oneline": "Anonymous transparent hugepages",
    "text-help": "Anonymous transparent hugepages",
    "pmid": 12628994,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.mapped_file",
    "text-oneline": "Bytes of mapped file (incl tmpfs/shmem)",
    "text-help": "Bytes of mapped file (incl tmpfs/shmem)",
    "pmid": 12628995,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.writeback",
    "text-oneline": "Bytes of file/anonymous cache queued for syncing",
    "text-help": "Bytes of file/anonymous cache queued for syncing",
    "pmid": 12628996,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.swap",
    "text-oneline": "Number of bytes of swap usage",
    "text-help": "Number of bytes of swap usage",
    "pmid": 12628997,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.pgpgin",
    "text-oneline": "Number of charging events to the memory cgroup",
    "text-help": "Number of charging events to the memory cgroup. The charging event happens\neach time a page is accounted as either mapped anon page(RSS) or cache page\n(Page Cache) to the cgroup.",
    "pmid": 12628998,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.pgpgout",
    "text-oneline": "Number of uncharging events to the memory cgroup",
    "text-help": "The uncharging event happens each time a page is unaccounted from\nthe cgroup.",
    "pmid": 12628999,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.pgfault",
    "text-oneline": "Total number of page faults",
    "text-help": "Total number of page faults",
    "pmid": 12629000,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.pgmajfault",
    "text-oneline": "Number of major page faults",
    "text-help": "Number of major page faults",
    "pmid": 12629001,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.inactive_anon",
    "text-oneline": "Anonymous and swap cache memory on inactive LRU list",
    "text-help": "Anonymous and swap cache memory on inactive LRU list",
    "pmid": 12629002,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.active_anon",
    "text-oneline": "Anonymous and swap cache memory on active LRU list.",
    "text-help": "Anonymous and swap cache memory on active LRU list.",
    "pmid": 12629003,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.inactive_file",
    "text-oneline": "File-backed memory on inactive LRU list",
    "text-help": "File-backed memory on inactive LRU list",
    "pmid": 12629004,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.active_file",
    "text-oneline": "File-backed memory on active LRU list",
    "text-help": "File-backed memory on active LRU list",
    "pmid": 12629005,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.unevictable",
    "text-oneline": "Memory that cannot be reclaimed (e.g. mlocked)",
    "text-help": "Memory that cannot be reclaimed (e.g. mlocked)",
    "pmid": 12629006,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.cache",
    "text-oneline": "Hierarchical, cumulative version of stat.cache",
    "text-help": "Hierarchical, cumulative version of stat.cache",
    "pmid": 12629022,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.rss",
    "text-oneline": "Hierarchical, cumulative version of stat.rss",
    "text-help": "Hierarchical, cumulative version of stat.rss",
    "pmid": 12629023,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.rss_huge",
    "text-oneline": "Hierarchical, cumulative version of stat.rss_huge",
    "text-help": "Hierarchical, cumulative version of stat.rss_huge",
    "pmid": 12629024,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.mapped_file",
    "text-oneline": "Hierarchical, cumulative version of stat.mapped_file",
    "text-help": "Hierarchical, cumulative version of stat.mapped_file",
    "pmid": 12629025,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.writeback",
    "text-oneline": "Hierarchical, cumulative version of stat.writeback",
    "text-help": "Hierarchical, cumulative version of stat.writeback",
    "pmid": 12629026,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.swap",
    "text-oneline": "Hierarchical, cumulative version of stat.swap",
    "text-help": "Hierarchical, cumulative version of stat.swap",
    "pmid": 12629027,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.pgpgin",
    "text-oneline": "Hierarchical, cumulative version of stat.pgpgin",
    "text-help": "Hierarchical, cumulative version of stat.pgpgin",
    "pmid": 12629028,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.pgpgout",
    "text-oneline": "Hierarchical, cumulative version of stat.pgpgout",
    "text-help": "Hierarchical, cumulative version of stat.pgpgout",
    "pmid": 12629029,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.pgfault",
    "text-oneline": "Hierarchical, cumulative version of stat.pgfault",
    "text-help": "Hierarchical, cumulative version of stat.pgfault",
    "pmid": 12629030,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.pgmajfault",
    "text-oneline": "Hierarchical, cumulative version of stat.pgmajfault",
    "text-help": "Hierarchical, cumulative version of stat.pgmajfault",
    "pmid": 12629031,
    "indom": 12582936,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.inactive_anon",
    "text-oneline": "Hierarchical, cumulative version of stat.inactive_anon",
    "text-help": "Hierarchical, cumulative version of stat.inactive_anon",
    "pmid": 12629032,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.active_anon",
    "text-oneline": "Hierarchical, cumulative version of stat.active_anon",
    "text-help": "Hierarchical, cumulative version of stat.active_anon",
    "pmid": 12629033,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.inactive_file",
    "text-oneline": "Hierarchical, cumulative version of stat.inactive_file",
    "text-help": "Hierarchical, cumulative version of stat.inactive_file",
    "pmid": 12629034,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.active_file",
    "text-oneline": "Hierarchical, cumulative version of stat.active_file",
    "text-help": "Hierarchical, cumulative version of stat.active_file",
    "pmid": 12629035,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.total.unevictable",
    "text-oneline": "Hierarchical, cumulative version of stat.unevictable",
    "text-help": "Hierarchical, cumulative version of stat.unevictable",
    "pmid": 12629036,
    "indom": 12582936,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.recent.rotated_anon",
    "text-oneline": "VM internal parameter (see mm/vmscan.c)",
    "text-help": "VM internal parameter (see mm/vmscan.c)",
    "pmid": 12629052,
    "indom": 12582936,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.recent.rotated_file",
    "text-oneline": "VM internal parameter (see mm/vmscan.c)",
    "text-help": "VM internal parameter (see mm/vmscan.c)",
    "pmid": 12629053,
    "indom": 12582936,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.recent.scanned_anon",
    "text-oneline": "VM internal parameter (see mm/vmscan.c)",
    "text-help": "VM internal parameter (see mm/vmscan.c)",
    "pmid": 12629054,
    "indom": 12582936,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.stat.recent.scanned_file",
    "text-oneline": "VM internal parameter (see mm/vmscan.c)",
    "text-help": "VM internal parameter (see mm/vmscan.c)",
    "pmid": 12629055,
    "indom": 12582936,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.memory.id.container",
    "text-oneline": "Each memory cgroups container based on heuristics",
    "text-help": "Each memory cgroups container based on heuristics",
    "pmid": 12629021,
    "indom": 12582936,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.netclass.classid",
    "text-oneline": "Network classifier cgroup class identifiers",
    "text-help": "Network classifier cgroup class identifiers",
    "pmid": 12631040,
    "indom": 12582937,
    "sem": "instant",
    "units": "",
    "type": "U64"
  },
  {
    "name": "cgroup.netclass.id.container",
    "text-oneline": "Each netclass cgroups container based on heuristics",
    "text-help": "Each netclass cgroups container based on heuristics",
    "pmid": 12631041,
    "indom": 12582937,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "cgroup.blkio.dev.sectors",
    "text-oneline": "Per-cgroup total (read+write) sectors",
    "text-help": "Per-cgroup total (read+write) sectors",
    "pmid": 12633118,
    "indom": 12582939,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.time",
    "text-oneline": "Per-device, per-cgroup total (read+write) time",
    "text-help": "Per-device, per-cgroup total (read+write) time",
    "pmid": 12633119,
    "indom": 12582939,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_merged.read",
    "text-oneline": "Per-cgroup read merges",
    "text-help": "Per-cgroup read merges",
    "pmid": 12633088,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_merged.write",
    "text-oneline": "Per-cgroup write merges",
    "text-help": "Per-cgroup write merges",
    "pmid": 12633089,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_merged.sync",
    "text-oneline": "Per-cgroup synchronous merges ",
    "text-help": "Per-cgroup synchronous merges ",
    "pmid": 12633090,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_merged.async",
    "text-oneline": "Per-cgroup asynchronous merges",
    "text-help": "Per-cgroup asynchronous merges",
    "pmid": 12633091,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_merged.total",
    "text-oneline": "Per-cgroup total merge operations",
    "text-help": "Per-cgroup total merge operations",
    "pmid": 12633092,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_queued.read",
    "text-oneline": "Per-cgroup queued read operations",
    "text-help": "Per-cgroup queued read operations",
    "pmid": 12633093,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_queued.write",
    "text-oneline": "Per-cgroup queued write operations",
    "text-help": "Per-cgroup queued write operations",
    "pmid": 12633094,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_queued.sync",
    "text-oneline": "Per-cgroup queued synchronous operations",
    "text-help": "Per-cgroup queued synchronous operations",
    "pmid": 12633095,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_queued.async",
    "text-oneline": "Per-cgroup queued asynchronous operations",
    "text-help": "Per-cgroup queued asynchronous operations",
    "pmid": 12633096,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_queued.total",
    "text-oneline": "Per-cgroup total operations queued",
    "text-help": "Per-cgroup total operations queued",
    "pmid": 12633097,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_bytes.read",
    "text-oneline": "Per-cgroup bytes transferred in reads",
    "text-help": "Per-cgroup bytes transferred in reads",
    "pmid": 12633098,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_bytes.write",
    "text-oneline": "Per-cgroup bytes transferred to disk in writes",
    "text-help": "Per-cgroup bytes transferred to disk in writes",
    "pmid": 12633099,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_bytes.sync",
    "text-oneline": "Per-cgroup sync bytes transferred",
    "text-help": "Per-cgroup sync bytes transferred",
    "pmid": 12633100,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_bytes.async",
    "text-oneline": "Per-cgroup async bytes transferred",
    "text-help": "Per-cgroup async bytes transferred",
    "pmid": 12633101,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_bytes.total",
    "text-oneline": "Per-cgroup total bytes transferred",
    "text-help": "Per-cgroup total bytes transferred",
    "pmid": 12633102,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_serviced.read",
    "text-oneline": "Per-cgroup read operations serviced",
    "text-help": "Per-cgroup read operations serviced",
    "pmid": 12633103,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_serviced.write",
    "text-oneline": "Per-cgroup write operations serviced",
    "text-help": "Per-cgroup write operations serviced",
    "pmid": 12633104,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_serviced.sync",
    "text-oneline": "Per-cgroup sync operations serviced",
    "text-help": "Per-cgroup sync operations serviced",
    "pmid": 12633105,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_serviced.async",
    "text-oneline": "Per-cgroup async operations serviced",
    "text-help": "Per-cgroup async operations serviced",
    "pmid": 12633106,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_serviced.total",
    "text-oneline": "Per-cgroup total operations serviced",
    "text-help": "Per-cgroup total operations serviced",
    "pmid": 12633107,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_time.read",
    "text-oneline": "Per-cgroup read IO service time",
    "text-help": "Per-cgroup read IO service time",
    "pmid": 12633108,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_time.write",
    "text-oneline": "Per-cgroup write IO service time",
    "text-help": "Per-cgroup write IO service time",
    "pmid": 12633109,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_time.sync",
    "text-oneline": "Per-cgroup sync IO service time",
    "text-help": "Per-cgroup sync IO service time",
    "pmid": 12633110,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_time.async",
    "text-oneline": "Per-cgroup async IO service time",
    "text-help": "Per-cgroup async IO service time",
    "pmid": 12633111,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_service_time.total",
    "text-oneline": "Per-cgroup IO service time",
    "text-help": "Per-cgroup IO service time",
    "pmid": 12633112,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_wait_time.read",
    "text-oneline": "Per-cgroup read IO wait time",
    "text-help": "Per-cgroup read IO wait time",
    "pmid": 12633113,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_wait_time.write",
    "text-oneline": "Per-cgroup write IO wait time",
    "text-help": "Per-cgroup write IO wait time",
    "pmid": 12633114,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_wait_time.sync",
    "text-oneline": "Per-cgroup sync IO wait time",
    "text-help": "Per-cgroup sync IO wait time",
    "pmid": 12633115,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_wait_time.async",
    "text-oneline": "Per-cgroup async IO wait time",
    "text-help": "Per-cgroup async IO wait time",
    "pmid": 12633116,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.io_wait_time.total",
    "text-oneline": "Per-cgroup total IO wait time",
    "text-help": "Per-cgroup total IO wait time",
    "pmid": 12633117,
    "indom": 12582939,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_service_bytes.read",
    "text-oneline": "Per-cgroup throttle bytes transferred in reads",
    "text-help": "Per-cgroup throttle bytes transferred in reads",
    "pmid": 12633120,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_service_bytes.write",
    "text-oneline": "Per-cgroup throttle bytes transferred to disk in writes",
    "text-help": "Per-cgroup throttle bytes transferred to disk in writes",
    "pmid": 12633121,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_service_bytes.sync",
    "text-oneline": "Per-cgroup throttle sync bytes transferred",
    "text-help": "Per-cgroup throttle sync bytes transferred",
    "pmid": 12633122,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_service_bytes.async",
    "text-oneline": "Per-cgroup throttle async bytes transferred",
    "text-help": "Per-cgroup throttle async bytes transferred",
    "pmid": 12633123,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_service_bytes.total",
    "text-oneline": "Per-cgroup total throttle bytes transferred",
    "text-help": "Per-cgroup total throttle bytes transferred",
    "pmid": 12633124,
    "indom": 12582939,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_serviced.read",
    "text-oneline": "Per-cgroup throttle read operations serviced",
    "text-help": "Per-cgroup throttle read operations serviced",
    "pmid": 12633125,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_serviced.write",
    "text-oneline": "Per-cgroup throttle write operations serviced",
    "text-help": "Per-cgroup throttle write operations serviced",
    "pmid": 12633126,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_serviced.sync",
    "text-oneline": "Per-cgroup throttle sync operations serviced",
    "text-help": "Per-cgroup throttle sync operations serviced",
    "pmid": 12633127,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_serviced.async",
    "text-oneline": "Per-cgroup throttle async operations serviced",
    "text-help": "Per-cgroup throttle async operations serviced",
    "pmid": 12633128,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.dev.throttle.io_serviced.total",
    "text-oneline": "Per-cgroup total throttle operations serviced",
    "text-help": "Per-cgroup total throttle operations serviced",
    "pmid": 12633129,
    "indom": 12582939,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.sectors",
    "text-oneline": "Per-cgroup total (read+write) sectors",
    "text-help": "Per-cgroup total (read+write) sectors",
    "pmid": 12633178,
    "indom": 12582938,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.time",
    "text-oneline": "Per-device, per-cgroup total (read+write) time",
    "text-help": "Per-device, per-cgroup total (read+write) time",
    "pmid": 12633179,
    "indom": 12582938,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_merged.read",
    "text-oneline": "Per-cgroup read merges",
    "text-help": "Per-cgroup read merges",
    "pmid": 12633148,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_merged.write",
    "text-oneline": "Per-cgroup write merges",
    "text-help": "Per-cgroup write merges",
    "pmid": 12633149,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_merged.sync",
    "text-oneline": "Per-cgroup synchronous merges ",
    "text-help": "Per-cgroup synchronous merges ",
    "pmid": 12633150,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_merged.async",
    "text-oneline": "Per-cgroup asynchronous merges",
    "text-help": "Per-cgroup asynchronous merges",
    "pmid": 12633151,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_merged.total",
    "text-oneline": "Per-cgroup total merge operations",
    "text-help": "Per-cgroup total merge operations",
    "pmid": 12633152,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_queued.read",
    "text-oneline": "Per-cgroup queued read operations",
    "text-help": "Per-cgroup queued read operations",
    "pmid": 12633153,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_queued.write",
    "text-oneline": "Per-cgroup queued write operations",
    "text-help": "Per-cgroup queued write operations",
    "pmid": 12633154,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_queued.sync",
    "text-oneline": "Per-cgroup queued synchronous operations",
    "text-help": "Per-cgroup queued synchronous operations",
    "pmid": 12633155,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_queued.async",
    "text-oneline": "Per-cgroup queued asynchronous operations",
    "text-help": "Per-cgroup queued asynchronous operations",
    "pmid": 12633156,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_queued.total",
    "text-oneline": "Per-cgroup total operations queued",
    "text-help": "Per-cgroup total operations queued",
    "pmid": 12633157,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_bytes.read",
    "text-oneline": "Per-cgroup bytes transferred in reads",
    "text-help": "Per-cgroup bytes transferred in reads",
    "pmid": 12633158,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_bytes.write",
    "text-oneline": "Per-cgroup bytes transferred to disk in writes",
    "text-help": "Per-cgroup bytes transferred to disk in writes",
    "pmid": 12633159,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_bytes.sync",
    "text-oneline": "Per-cgroup sync bytes transferred",
    "text-help": "Per-cgroup sync bytes transferred",
    "pmid": 12633160,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_bytes.async",
    "text-oneline": "Per-cgroup async bytes transferred",
    "text-help": "Per-cgroup async bytes transferred",
    "pmid": 12633161,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_bytes.total",
    "text-oneline": "Per-cgroup total bytes transferred",
    "text-help": "Per-cgroup total bytes transferred",
    "pmid": 12633162,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_serviced.read",
    "text-oneline": "Per-cgroup read operations serviced",
    "text-help": "Per-cgroup read operations serviced",
    "pmid": 12633163,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_serviced.write",
    "text-oneline": "Per-cgroup write operations serviced",
    "text-help": "Per-cgroup write operations serviced",
    "pmid": 12633164,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_serviced.sync",
    "text-oneline": "Per-cgroup sync operations serviced",
    "text-help": "Per-cgroup sync operations serviced",
    "pmid": 12633165,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_serviced.async",
    "text-oneline": "Per-cgroup async operations serviced",
    "text-help": "Per-cgroup async operations serviced",
    "pmid": 12633166,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_serviced.total",
    "text-oneline": "Per-cgroup total operations serviced",
    "text-help": "Per-cgroup total operations serviced",
    "pmid": 12633167,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_time.read",
    "text-oneline": "Per-cgroup read IO service time",
    "text-help": "Per-cgroup read IO service time",
    "pmid": 12633168,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_time.write",
    "text-oneline": "Per-cgroup write IO service time",
    "text-help": "Per-cgroup write IO service time",
    "pmid": 12633169,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_time.sync",
    "text-oneline": "Per-cgroup sync IO service time",
    "text-help": "Per-cgroup sync IO service time",
    "pmid": 12633170,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_time.async",
    "text-oneline": "Per-cgroup async IO service time",
    "text-help": "Per-cgroup async IO service time",
    "pmid": 12633171,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_service_time.total",
    "text-oneline": "Per-cgroup IO service time",
    "text-help": "Per-cgroup IO service time",
    "pmid": 12633172,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_wait_time.read",
    "text-oneline": "Per-cgroup read IO wait time",
    "text-help": "Per-cgroup read IO wait time",
    "pmid": 12633173,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_wait_time.write",
    "text-oneline": "Per-cgroup write IO wait time",
    "text-help": "Per-cgroup write IO wait time",
    "pmid": 12633174,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_wait_time.sync",
    "text-oneline": "Per-cgroup sync IO wait time",
    "text-help": "Per-cgroup sync IO wait time",
    "pmid": 12633175,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_wait_time.async",
    "text-oneline": "Per-cgroup async IO wait time",
    "text-help": "Per-cgroup async IO wait time",
    "pmid": 12633176,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.io_wait_time.total",
    "text-oneline": "Per-cgroup total IO wait time",
    "text-help": "Per-cgroup total IO wait time",
    "pmid": 12633177,
    "indom": 12582938,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_service_bytes.read",
    "text-oneline": "Per-cgroup throttle bytes transferred in reads",
    "text-help": "Per-cgroup throttle bytes transferred in reads",
    "pmid": 12633180,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_service_bytes.write",
    "text-oneline": "Per-cgroup throttle bytes transferred to disk in writes",
    "text-help": "Per-cgroup throttle bytes transferred to disk in writes",
    "pmid": 12633181,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_service_bytes.sync",
    "text-oneline": "Per-cgroup throttle sync bytes transferred",
    "text-help": "Per-cgroup throttle sync bytes transferred",
    "pmid": 12633182,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_service_bytes.async",
    "text-oneline": "Per-cgroup throttle async bytes transferred",
    "text-help": "Per-cgroup throttle async bytes transferred",
    "pmid": 12633183,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_service_bytes.total",
    "text-oneline": "Per-cgroup throttle total bytes transferred",
    "text-help": "Per-cgroup throttle total bytes transferred",
    "pmid": 12633184,
    "indom": 12582938,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_serviced.read",
    "text-oneline": "Per-cgroup throttle read operations serviced",
    "text-help": "Per-cgroup throttle read operations serviced",
    "pmid": 12633185,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_serviced.write",
    "text-oneline": "Per-cgroup throttle write operations serviced",
    "text-help": "Per-cgroup throttle write operations serviced",
    "pmid": 12633186,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_serviced.sync",
    "text-oneline": "Per-cgroup throttle sync operations serviced",
    "text-help": "Per-cgroup throttle sync operations serviced",
    "pmid": 12633187,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_serviced.async",
    "text-oneline": "Per-cgroup throttle async operations serviced",
    "text-help": "Per-cgroup throttle async operations serviced",
    "pmid": 12633188,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.all.throttle.io_serviced.total",
    "text-oneline": "Per-cgroup total throttle operations serviced",
    "text-help": "Per-cgroup total throttle operations serviced",
    "pmid": 12633189,
    "indom": 12582938,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "cgroup.blkio.id.container",
    "text-oneline": "Each blkio cgroups container based on heuristics",
    "text-help": "Each blkio cgroups container based on heuristics",
    "pmid": 12633130,
    "indom": 12582938,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.nprocs",
    "text-oneline": "instantaneous number of processes",
    "text-help": "instantaneous number of processes",
    "pmid": 12591203,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.oom_score",
    "text-oneline": "out-of-memory process selection score (from /proc/<pid>/oom_score)",
    "text-help": "out-of-memory process selection score (from /proc/<pid>/oom_score)",
    "pmid": 12646400,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.tgid",
    "text-oneline": "thread group identifier",
    "text-help": "thread group identifier",
    "pmid": 12607529,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.ngid",
    "text-oneline": "NUMA group identifier (from /proc/<pid>/status)",
    "text-help": "NUMA group identifier (from /proc/<pid>/status)",
    "pmid": 12607520,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.cpusallowed",
    "text-oneline": "the cpus allowed list (from /proc/<pid>/status)",
    "text-help": "the cpus allowed list (from /proc/<pid>/status)",
    "pmid": 12607519,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.nvctxsw",
    "text-oneline": "number of non-voluntary context switches (from /proc/<pid>/status)",
    "text-help": "number of non-voluntary context switches (from /proc/<pid>/status)",
    "pmid": 12607518,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.vctxsw",
    "text-oneline": "number of voluntary context switches (from /proc/<pid>/status)",
    "text-help": "number of voluntary context switches (from /proc/<pid>/status)",
    "pmid": 12607517,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.labels",
    "text-oneline": "list of processes security labels (from /proc/<pid>/attr/current)",
    "text-help": "list of processes security labels (from /proc/<pid>/attr/current)",
    "pmid": 12595200,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.cgroups",
    "text-oneline": "list of processes cgroups (from /proc/<pid>/cgroup)",
    "text-help": "list of processes cgroups (from /proc/<pid>/cgroup)",
    "pmid": 12594176,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.threads",
    "text-oneline": "number of threads (from /proc/<pid>/status)",
    "text-help": "number of threads (from /proc/<pid>/status)",
    "pmid": 12607516,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.sigcatch_s",
    "text-oneline": "caught signals mask in string form (from /proc/<pid>/status)",
    "text-help": "caught signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12607507,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.sigignore_s",
    "text-oneline": "ignored signals mask in string form (from /proc/<pid>/status)",
    "text-help": "ignored signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12607506,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.blocked_s",
    "text-oneline": "blocked signals mask in string form (from /proc/<pid>/status)",
    "text-help": "blocked signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12607505,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.signal_s",
    "text-oneline": "pending signals mask in string form (from /proc/<pid>/status)",
    "text-help": "pending signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12607504,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.environ",
    "text-oneline": "process environment (from /proc/<pid>/environ ascii space replaces null).",
    "text-help": "process environment (from /proc/<pid>/environ ascii space replaces null).",
    "pmid": 12591151,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.cguest_time",
    "text-oneline": "Guest time of the process���s children",
    "text-help": "Guest time of the process���s children",
    "pmid": 12591150,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.guest_time",
    "text-oneline": "Guest time of the process",
    "text-help": "Time spent running a virtual CPU for a guest operating system.\n",
    "pmid": 12591149,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.delayacct_blkio_time",
    "text-oneline": "Aggregated block I/O delays",
    "text-help": "Aggregated block I/O delays",
    "pmid": 12591148,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.policy",
    "text-oneline": "Scheduling policy",
    "text-help": "Scheduling policy",
    "pmid": 12591147,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.rt_priority",
    "text-oneline": "Real-time scheduling priority, a number in the range 1 to 99",
    "text-help": "Real-time scheduling priority, a number in the range 1 to 99",
    "pmid": 12591146,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.psargs",
    "text-oneline": "full command string",
    "text-help": "full command string",
    "pmid": 12591145,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.wchan_s",
    "text-oneline": "name of an event for which the process is sleeping (if blank, the process is running).",
    "text-help": "This field needs access to a namelist file for proper \naddress-to-symbol name translation. If no namelist file\nis available, the address is printed instead. The namelist\nfile must match the current Linux kernel exactly.\nThe search path for the namelist file is as follows:\n\t/boot/System.map-`uname -r`\n\t/boot/System.map\n\t/lib/modules/`uname -r`/System.map\n\t/usr/src/linux/System.map\n\t/System.map\n",
    "pmid": 12591144,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.ttyname",
    "text-oneline": "name of controlling tty device, or ? if none. See also proc.psinfo.tty.",
    "text-help": "name of controlling tty device, or ? if none. See also proc.psinfo.tty.",
    "pmid": 12591143,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.processor",
    "text-oneline": "last CPU the process was running on",
    "text-help": "last CPU the process was running on",
    "pmid": 12591142,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.exit_signal",
    "text-oneline": "the value in the exit_signal field of struct task_struct for the process",
    "text-help": "the value in the exit_signal field of struct task_struct for the process",
    "pmid": 12591141,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.cnswap",
    "text-oneline": "count of page swap operations of all exited children",
    "text-help": "count of page swap operations of all exited children",
    "pmid": 12591140,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.nswap",
    "text-oneline": "count of page swap operations",
    "text-help": "count of page swap operations",
    "pmid": 12591139,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.wchan",
    "text-oneline": "wait channel, kernel address this process is blocked or sleeping on",
    "text-help": "wait channel, kernel address this process is blocked or sleeping on",
    "pmid": 12591138,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.sigcatch",
    "text-oneline": "the value in the sigcatch field of struct task_struct for the process",
    "text-help": "the value in the sigcatch field of struct task_struct for the process",
    "pmid": 12591137,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.sigignore",
    "text-oneline": "the value in the sigignore field of struct task_struct for the process",
    "text-help": "the value in the sigignore field of struct task_struct for the process",
    "pmid": 12591136,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.blocked",
    "text-oneline": "the value in the blocked field of struct task_struct for the process",
    "text-help": "the value in the blocked field of struct task_struct for the process",
    "pmid": 12591135,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.signal",
    "text-oneline": "the value in the signal field of struct task_struct for the process",
    "text-help": "the value in the signal field of struct task_struct for the process",
    "pmid": 12591134,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.eip",
    "text-oneline": "the value in the eip field of struct task_struct for the process",
    "text-help": "the value in the eip field of struct task_struct for the process",
    "pmid": 12591133,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.esp",
    "text-oneline": "the value in the esp field of struct task_struct for the process",
    "text-help": "the value in the esp field of struct task_struct for the process",
    "pmid": 12591132,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.start_stack",
    "text-oneline": "address of the stack segment for the process",
    "text-help": "address of the stack segment for the process",
    "pmid": 12591131,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.end_code",
    "text-oneline": "address of the end of the code segment for the process",
    "text-help": "address of the end of the code segment for the process",
    "pmid": 12591130,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.start_code",
    "text-oneline": "address of the start of the code segment for the process",
    "text-help": "address of the start of the code segment for the process",
    "pmid": 12591129,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.rss_rlim",
    "text-oneline": "limit on resident set size of process",
    "text-help": "limit on resident set size of process",
    "pmid": 12591128,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.rss",
    "text-oneline": "resident set size (i.e. physical memory) of the process",
    "text-help": "resident set size (i.e. physical memory) of the process",
    "pmid": 12591127,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.vsize",
    "text-oneline": "virtual size of the process in Kbytes",
    "text-help": "virtual size of the process in Kbytes",
    "pmid": 12591126,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.start_time",
    "text-oneline": "start time of the process relative to system boot time (in ms)",
    "text-help": "start time of the process relative to system boot time (in ms)",
    "pmid": 12591125,
    "indom": 12582921,
    "sem": "discrete",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.it_real_value",
    "text-oneline": "current interval timer value (zero if none)",
    "text-help": "current interval timer value (zero if none)",
    "pmid": 12591124,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.nice",
    "text-oneline": "process nice value (negative nice values are lower priority)",
    "text-help": "process nice value (negative nice values are lower priority)",
    "pmid": 12591122,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "proc.psinfo.priority",
    "text-oneline": "scheduling priority value",
    "text-help": "scheduling priority value",
    "pmid": 12591121,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "proc.psinfo.cstime",
    "text-oneline": "time (in ms) spent executing system code of all exited children",
    "text-help": "time (in ms) spent executing system code of all exited children",
    "pmid": 12591120,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.cutime",
    "text-oneline": "time (in ms) spent executing user code of all exited children",
    "text-help": "time (in ms) spent executing user code of all exited children",
    "pmid": 12591119,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.stime",
    "text-oneline": "time (in ms) spent executing system code (calls) since process started",
    "text-help": "time (in ms) spent executing system code (calls) since process started",
    "pmid": 12591118,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.utime",
    "text-oneline": "time (in ms) spent executing user code since process started",
    "text-help": "time (in ms) spent executing user code since process started",
    "pmid": 12591117,
    "indom": 12582921,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "proc.psinfo.cmaj_flt",
    "text-oneline": "count of page faults other than reclaims of all exited children",
    "text-help": "count of page faults other than reclaims of all exited children",
    "pmid": 12591116,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.maj_flt",
    "text-oneline": "count of page faults other than reclaims",
    "text-help": "count of page faults other than reclaims",
    "pmid": 12591115,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.cmin_flt",
    "text-oneline": "count of minor page faults (i.e. reclaims) of all exited children",
    "text-help": "count of minor page faults (i.e. reclaims) of all exited children",
    "pmid": 12591114,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.minflt",
    "text-oneline": "count of minor page faults (i.e. reclaims)",
    "text-help": "count of minor page faults (i.e. reclaims)",
    "pmid": 12591113,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.flags",
    "text-oneline": "process state flags, as a bitmap",
    "text-help": "process state flags, as a bitmap",
    "pmid": 12591112,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.tty_pgrp",
    "text-oneline": "controlling tty process group identifier",
    "text-help": "controlling tty process group identifier",
    "pmid": 12591111,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.tty",
    "text-oneline": "controlling tty device number (zero if none)",
    "text-help": "controlling tty device number (zero if none)",
    "pmid": 12591110,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.session",
    "text-oneline": "process session identifier",
    "text-help": "process session identifier",
    "pmid": 12591109,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.pgrp",
    "text-oneline": "process group identifier",
    "text-help": "process group identifier",
    "pmid": 12591108,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.ppid",
    "text-oneline": "parent process identifier",
    "text-help": "parent process identifier",
    "pmid": 12591107,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.psinfo.sname",
    "text-oneline": "process state identifier (see ps(1)). See also proc.runq metrics.",
    "text-help": "process state identifier (see ps(1)). See also proc.runq metrics.",
    "pmid": 12591106,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.cmd",
    "text-oneline": "command name",
    "text-help": "command name",
    "pmid": 12591105,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.psinfo.pid",
    "text-oneline": "process identifier",
    "text-help": "process identifier",
    "pmid": 12591104,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmnonlib",
    "text-oneline": "difference between process real memory use (vmreal) and libraries (vmlib)",
    "text-help": "difference between process real memory use (vmreal) and libraries (vmlib)",
    "pmid": 12607532,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "proc.memory.vmreal",
    "text-oneline": "sum of resident set size and virtual memory swapped out",
    "text-help": "sum of resident set size and virtual memory swapped out",
    "pmid": 12607531,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "proc.memory.vmpte",
    "text-oneline": "memory occupied by page table entries (from /proc/<pid>/status)",
    "text-help": "memory occupied by page table entries (from /proc/<pid>/status)",
    "pmid": 12607524,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmhwm",
    "text-oneline": "peak usage of physical memory (from /proc/<pid>/status)",
    "text-help": "peak usage of physical memory (from /proc/<pid>/status)",
    "pmid": 12607523,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmpin",
    "text-oneline": "fixed physical address unswappable pages (from /proc/<pid>/status)",
    "text-help": "fixed physical address unswappable pages (from /proc/<pid>/status)",
    "pmid": 12607522,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmpeak",
    "text-oneline": "peak virtual memory size (from /proc/<pid>/status)",
    "text-help": "peak virtual memory size (from /proc/<pid>/status)",
    "pmid": 12607521,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmswap",
    "text-oneline": "virtual memory size currently swapped out (from /proc/<pid>/status)",
    "text-help": "virtual memory size currently swapped out (from /proc/<pid>/status)",
    "pmid": 12607515,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmlib",
    "text-oneline": "virtual memory used for libraries (from /proc/<pid>/status)",
    "text-help": "virtual memory used for libraries (from /proc/<pid>/status)",
    "pmid": 12607514,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmexe",
    "text-oneline": "virtual memory used for non-library executable code (from /proc/<pid>/status)",
    "text-help": "virtual memory used for non-library executable code (from /proc/<pid>/status)",
    "pmid": 12607513,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmstack",
    "text-oneline": "virtual memory used for stack (from /proc/<pid>/status)",
    "text-help": "virtual memory used for stack (from /proc/<pid>/status)",
    "pmid": 12607512,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmdata",
    "text-oneline": "virtual memory used for data (from /proc/<pid>/status)",
    "text-help": "virtual memory used for data (from /proc/<pid>/status)",
    "pmid": 12607511,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmrss",
    "text-oneline": "resident virtual memory (from /proc/<pid>/status)",
    "text-help": "resident virtual memory (from /proc/<pid>/status)",
    "pmid": 12607510,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmlock",
    "text-oneline": "locked virtual memory (from /proc/<pid>/status)",
    "text-help": "locked virtual memory (from /proc/<pid>/status)",
    "pmid": 12607509,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.vmsize",
    "text-oneline": "total virtual memory (from /proc/<pid>/status)",
    "text-help": "total virtual memory (from /proc/<pid>/status)",
    "pmid": 12607508,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.maps",
    "text-oneline": "table of memory mapped by process in string form from /proc/<pid>/maps",
    "text-help": "table of memory mapped by process in string form from /proc/<pid>/maps",
    "pmid": 12592135,
    "indom": 12582921,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.memory.dirty",
    "text-oneline": "instantaneous amount of memory that has been modified by the process, in Kbytes",
    "text-help": "instantaneous amount of memory that has been modified by the process, in Kbytes",
    "pmid": 12592134,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.datrss",
    "text-oneline": "instantaneous resident size of process data segment, in Kbytes",
    "text-help": "instantaneous resident size of process data segment, in Kbytes",
    "pmid": 12592133,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.librss",
    "text-oneline": "instantaneous resident size of library code mapped by the process, in Kbytes",
    "text-help": "instantaneous resident size of library code mapped by the process, in Kbytes",
    "pmid": 12592132,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.textrss",
    "text-oneline": "instantaneous resident size of process code segment in Kbytes",
    "text-help": "instantaneous resident size of process code segment in Kbytes",
    "pmid": 12592131,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.share",
    "text-oneline": "instantaneous amount of memory shared by this process with other processes ",
    "text-help": "instantaneous amount of memory shared by this process with other processes ",
    "pmid": 12592130,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.rss",
    "text-oneline": "instantaneous resident size of process, excluding page table and task structure.",
    "text-help": "instantaneous resident size of process, excluding page table and task structure.",
    "pmid": 12592129,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.memory.size",
    "text-oneline": "instantaneous virtual size of process, excluding page table and task structure.",
    "text-help": "instantaneous virtual size of process, excluding page table and task structure.",
    "pmid": 12592128,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.id.container",
    "text-oneline": "name of processes container (from /proc/<pid>/cgroup heuristics)",
    "text-help": "name of processes container (from /proc/<pid>/cgroup heuristics)",
    "pmid": 12594177,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.fsgid_nm",
    "text-oneline": "filesystem group name based on filesystem group ID from /proc/<pid>/status",
    "text-help": "filesystem group name based on filesystem group ID from /proc/<pid>/status",
    "pmid": 12607503,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.sgid_nm",
    "text-oneline": "saved group name based on saved group ID from /proc/<pid>/status",
    "text-help": "saved group name based on saved group ID from /proc/<pid>/status",
    "pmid": 12607502,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.egid_nm",
    "text-oneline": "effective group name based on effective group ID from /proc/<pid>/status",
    "text-help": "effective group name based on effective group ID from /proc/<pid>/status",
    "pmid": 12607501,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.gid_nm",
    "text-oneline": "real group name based on real group ID from /proc/<pid>/status",
    "text-help": "real group name based on real group ID from /proc/<pid>/status",
    "pmid": 12607500,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.fsuid_nm",
    "text-oneline": "filesystem user name based on filesystem user ID from /proc/<pid>/status",
    "text-help": "filesystem user name based on filesystem user ID from /proc/<pid>/status",
    "pmid": 12607499,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.suid_nm",
    "text-oneline": "saved user name based on saved user ID from /proc/<pid>/status",
    "text-help": "saved user name based on saved user ID from /proc/<pid>/status",
    "pmid": 12607498,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.euid_nm",
    "text-oneline": "effective user name based on effective user ID from /proc/<pid>/status",
    "text-help": "effective user name based on effective user ID from /proc/<pid>/status",
    "pmid": 12607497,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.uid_nm",
    "text-oneline": "real user name based on real user ID from /proc/<pid>/status",
    "text-help": "real user name based on real user ID from /proc/<pid>/status",
    "pmid": 12607496,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.id.fsgid",
    "text-oneline": "filesystem group ID from /proc/<pid>/status",
    "text-help": "filesystem group ID from /proc/<pid>/status",
    "pmid": 12607495,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.sgid",
    "text-oneline": "saved group ID from /proc/<pid>/status",
    "text-help": "saved group ID from /proc/<pid>/status",
    "pmid": 12607494,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.egid",
    "text-oneline": "effective group ID from /proc/<pid>/status",
    "text-help": "effective group ID from /proc/<pid>/status",
    "pmid": 12607493,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.gid",
    "text-oneline": "real group ID from /proc/<pid>/status",
    "text-help": "real group ID from /proc/<pid>/status",
    "pmid": 12607492,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.fsuid",
    "text-oneline": "filesystem user ID from /proc/<pid>/status",
    "text-help": "filesystem user ID from /proc/<pid>/status",
    "pmid": 12607491,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.suid",
    "text-oneline": "saved user ID from /proc/<pid>/status",
    "text-help": "saved user ID from /proc/<pid>/status",
    "pmid": 12607490,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.euid",
    "text-oneline": "effective user ID from /proc/<pid>/status",
    "text-help": "effective user ID from /proc/<pid>/status",
    "pmid": 12607489,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.id.uid",
    "text-oneline": "real user ID from /proc/<pid>/status",
    "text-help": "real user ID from /proc/<pid>/status",
    "pmid": 12607488,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.io.cancelled_write_bytes",
    "text-oneline": "physical device write cancelled bytes",
    "text-help": "Number of bytes cancelled via truncate by this process.  Actual physical\nwrites for an individual process can be calculated as:\n\tproc.io.write_bytes - proc.io.cancelled_write_bytes.\n",
    "pmid": 12615686,
    "indom": 12582921,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.io.write_bytes",
    "text-oneline": "physical device write bytes",
    "text-help": "Number of bytes physically written to devices on behalf of this process.\nThis must be reduced by any truncated I/O (proc.io.cancelled_write_bytes).\n",
    "pmid": 12615685,
    "indom": 12582921,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.io.read_bytes",
    "text-oneline": "physical device read bytes",
    "text-help": "Number of bytes physically read on by devices on behalf of this process.\n",
    "pmid": 12615684,
    "indom": 12582921,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.io.syscw",
    "text-oneline": "write(), writev() and sendfile() send system calls",
    "text-help": "Extended accounting information - count of number of calls to the\nwrite(2), writev(2) and sendfile(2) syscalls by each process.\n",
    "pmid": 12615683,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "proc.io.syscr",
    "text-oneline": "read(), readv() and sendfile() receive system calls",
    "text-help": "Extended accounting information - count of number of calls to the\nread(2), readv(2) and sendfile(2) syscalls by each process.\n",
    "pmid": 12615682,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "proc.io.wchar",
    "text-oneline": "write(), writev() and sendfile() send bytes",
    "text-help": "Extended accounting information - count of the number of bytes that\nhave passed over the write(2), writev(2) and sendfile(2) syscalls by\neach process.\n",
    "pmid": 12615681,
    "indom": 12582921,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.io.rchar",
    "text-oneline": "read(), readv() and sendfile() receive bytes",
    "text-help": "Extended accounting information - count of the number of bytes that\nhave passed over the read(2), readv(2) and sendfile(2) syscalls by\neach process.\n",
    "pmid": 12615680,
    "indom": 12582921,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.schedstat.pcount",
    "text-oneline": "number of times a process is allowed to run",
    "text-help": "Number of times a process has been scheduled to run on a CPU (this is\nincremented when a task actually reaches a CPU to run on, not simply\nwhen it is added to the run queue).\n",
    "pmid": 12614658,
    "indom": 12582921,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "proc.schedstat.run_delay",
    "text-oneline": "run queue time",
    "text-help": "Length of time in nanoseconds that a process spent waiting to be scheduled\nto run in the run queue.\n",
    "pmid": 12614657,
    "indom": 12582921,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "proc.schedstat.cpu_time",
    "text-oneline": "runnable (scheduled) + run time",
    "text-help": "Length of time in nanoseconds that a process has been running, including\nscheduling time.\n",
    "pmid": 12614656,
    "indom": 12582921,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "proc.fd.count",
    "text-oneline": "open file descriptors",
    "text-help": "Number of file descriptors this process has open.\n",
    "pmid": 12635136,
    "indom": 12582921,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "proc.namespaces.envid",
    "text-oneline": "OpenVZ container identifier",
    "text-help": "OpenVZ container identifier",
    "pmid": 12607530,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.namespaces.sid",
    "text-oneline": "descendant namespace session ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace session ID hierarchy (/proc/<pid>/status)",
    "pmid": 12607528,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.namespaces.pgid",
    "text-oneline": "descendant namespace process group ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace process group ID hierarchy (/proc/<pid>/status)",
    "pmid": 12607527,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.namespaces.pid",
    "text-oneline": "descendant namespace process ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace process ID hierarchy (/proc/<pid>/status)",
    "pmid": 12607526,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.namespaces.tgid",
    "text-oneline": "descendant namespace thread group ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace thread group ID hierarchy (/proc/<pid>/status)",
    "pmid": 12607525,
    "indom": 12582921,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "proc.runq.runnable",
    "text-oneline": "number of runnable (on run queue) processes",
    "text-help": "Instantaneous number of runnable (on run queue) processes;\nstate 'R' in ps(1).",
    "pmid": 12596224,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.blocked",
    "text-oneline": "number of processes in uninterruptible sleep",
    "text-help": "Instantaneous number of processes in uninterruptible sleep or parked;\nstate 'D' in ps(1).",
    "pmid": 12596225,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.sleeping",
    "text-oneline": "number of processes sleeping",
    "text-help": "Instantaneous number of processes sleeping; state 'S' in ps(1).",
    "pmid": 12596226,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.stopped",
    "text-oneline": "number of traced, stopped or suspended processes",
    "text-help": "Instantaneous number of traced, stopped or suspended processes; state\n'tT' in ps(1).",
    "pmid": 12596227,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.swapped",
    "text-oneline": "number of processes that are swapped",
    "text-help": "Instantaneous number of processes (excluding kernel threads) that are\nswapped; state 'SW' in ps(1).",
    "pmid": 12596228,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.defunct",
    "text-oneline": "number of defunct/zombie processes",
    "text-help": "Instantaneous number of defunct/zombie processes; state 'Z' in ps(1).",
    "pmid": 12596229,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.unknown",
    "text-oneline": "number of processes is an unknown state",
    "text-help": "Instantaneous number of processes is an unknown state, including all\nkernel threads",
    "pmid": 12596230,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.runq.kernel",
    "text-oneline": "number of kernel threads",
    "text-help": "Instantaneous number of processes with virtual size of zero (kernel threads)",
    "pmid": 12596231,
    "sem": "instant",
    "units": "count",
    "type": "32"
  },
  {
    "name": "proc.control.all.threads",
    "text-oneline": "process indom includes threads",
    "text-help": "If set to one, the process instance domain as reported by pmdaproc\ncontains all threads as well as the processes that started them.\nIf set to zero, the process instance domain contains only processes.\n\nThis setting is persistent for the life of pmdaproc and affects all\nclient tools that request instances and values from pmdaproc.\nUse either pmstore(1) or pmStore(3) to modify this metric.",
    "pmid": 12593153,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.control.perclient.threads",
    "text-oneline": "for a client, process indom includes threads",
    "text-help": "If set to one, the process instance domain as reported by pmdaproc\ncontains all threads as well as the processes that started them.\nIf set to zero, the process instance domain contains only processes.\n\nThis setting is only visible to the active client context.  In other\nwords, storing into this metric has no effect for other monitoring\ntools.  See proc.control.all.threads, if that is the desired outcome.\nOnly pmStore(3) can effectively set this metric (pmstore(1) cannot).",
    "pmid": 12593154,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "proc.control.perclient.cgroups",
    "text-oneline": "for a client, process indom reflects specific cgroups",
    "text-help": "If set to the empty string (the default), the process instance domain\nas reported by pmdaproc contains all processes.  However, a cgroup\nname (full path) can be stored into this metric in order to restrict\nprocesses reported to only those within the specified cgroup.  This\nset is further affected by the value of proc.control.perclient.threads.\n\nThis setting is only visible to the active client context.  In other\nwords, storing into this metric has no effect for other monitoring\ntools.  pmStore(3) must be used to set this metric (not pmstore(1)).",
    "pmid": 12593155,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.nprocs",
    "text-oneline": "instantaneous number of interesting (\"hot\") processes",
    "text-help": "instantaneous number of interesting (\"hot\") processes",
    "pmid": 12636259,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.oom_score",
    "text-oneline": "out-of-memory process selection score (from /proc/<pid>/oom_score)",
    "text-help": "out-of-memory process selection score (from /proc/<pid>/oom_score)",
    "pmid": 12647424,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.tgid",
    "text-oneline": "thread group identifier",
    "text-help": "thread group identifier",
    "pmid": 12640297,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.ngid",
    "text-oneline": "NUMA group identifier (from /proc/<pid>/status)",
    "text-help": "NUMA group identifier (from /proc/<pid>/status)",
    "pmid": 12640288,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.cpusallowed",
    "text-oneline": "the cpus allowed list (from /proc/<pid>/status)",
    "text-help": "the cpus allowed list (from /proc/<pid>/status)",
    "pmid": 12640287,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.nvctxsw",
    "text-oneline": "number of non-voluntary context switches (from /proc/<pid>/status)",
    "text-help": "number of non-voluntary context switches (from /proc/<pid>/status)",
    "pmid": 12640286,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.vctxsw",
    "text-oneline": "number of voluntary context switches (from /proc/<pid>/status)",
    "text-help": "number of voluntary context switches (from /proc/<pid>/status)",
    "pmid": 12640285,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.labels",
    "text-oneline": "list of processes security labels (from /proc/<pid>/attr/current)",
    "text-help": "list of processes security labels (from /proc/<pid>/attr/current)",
    "pmid": 12639232,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.cgroups",
    "text-oneline": "list of processes cgroups (from /proc/<pid>/cgroup)",
    "text-help": "list of processes cgroups (from /proc/<pid>/cgroup)",
    "pmid": 12638208,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.threads",
    "text-oneline": "number of threads (from /proc/<pid>/status)",
    "text-help": "number of threads (from /proc/<pid>/status)",
    "pmid": 12640284,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.sigcatch_s",
    "text-oneline": "caught signals mask in string form (from /proc/<pid>/status)",
    "text-help": "caught signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12640275,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.sigignore_s",
    "text-oneline": "ignored signals mask in string form (from /proc/<pid>/status)",
    "text-help": "ignored signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12640274,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.blocked_s",
    "text-oneline": "blocked signals mask in string form (from /proc/<pid>/status)",
    "text-help": "blocked signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12640273,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.signal_s",
    "text-oneline": "pending signals mask in string form (from /proc/<pid>/status)",
    "text-help": "pending signals mask in string form (from /proc/<pid>/status)",
    "pmid": 12640272,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.environ",
    "text-oneline": "process environment (from /proc/<pid>/environ ascii space replaces null).",
    "text-help": "process environment (from /proc/<pid>/environ ascii space replaces null).",
    "pmid": 12636207,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.cguest_time",
    "text-oneline": "Guest time of the process���s children",
    "text-help": "Guest time of the process���s children",
    "pmid": 12636206,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.guest_time",
    "text-oneline": "Guest time of the process",
    "text-help": "Time spent running a virtual CPU for a guest operating system.\n",
    "pmid": 12636205,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.delayacct_blkio_time",
    "text-oneline": "Aggregated block I/O delays",
    "text-help": "Aggregated block I/O delays",
    "pmid": 12636204,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.policy",
    "text-oneline": "Scheduling policy",
    "text-help": "Scheduling policy",
    "pmid": 12636203,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.rt_priority",
    "text-oneline": "Real-time scheduling priority, a number in the range 1 to 99",
    "text-help": "Real-time scheduling priority, a number in the range 1 to 99",
    "pmid": 12636202,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.psargs",
    "text-oneline": "full command string",
    "text-help": "full command string",
    "pmid": 12636201,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.wchan_s",
    "text-oneline": "name of an event for which the process is sleeping (if blank, the process is running).",
    "text-help": "This field needs access to a namelist file for proper \naddress-to-symbol name translation. If no namelist file\nis available, the address is printed instead. The namelist\nfile must match the current Linux kernel exactly.\nThe search path for the namelist file is as follows:\n\t/boot/System.map-`uname -r`\n\t/boot/System.map\n\t/lib/modules/`uname -r`/System.map\n\t/usr/src/linux/System.map\n\t/System.map\n",
    "pmid": 12636200,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.ttyname",
    "text-oneline": "name of controlling tty device, or ? if none. See also proc.psinfo.tty.",
    "text-help": "name of controlling tty device, or ? if none. See also proc.psinfo.tty.",
    "pmid": 12636199,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.processor",
    "text-oneline": "last CPU the process was running on",
    "text-help": "last CPU the process was running on",
    "pmid": 12636198,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.exit_signal",
    "text-oneline": "the value in the exit_signal field of struct task_struct for the process",
    "text-help": "the value in the exit_signal field of struct task_struct for the process",
    "pmid": 12636197,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.cnswap",
    "text-oneline": "count of page swap operations of all exited children",
    "text-help": "count of page swap operations of all exited children",
    "pmid": 12636196,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.nswap",
    "text-oneline": "count of page swap operations",
    "text-help": "count of page swap operations",
    "pmid": 12636195,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.wchan",
    "text-oneline": "wait channel, kernel address this process is blocked or sleeping on",
    "text-help": "wait channel, kernel address this process is blocked or sleeping on",
    "pmid": 12636194,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.sigcatch",
    "text-oneline": "the value in the sigcatch field of struct task_struct for the process",
    "text-help": "the value in the sigcatch field of struct task_struct for the process",
    "pmid": 12636193,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.sigignore",
    "text-oneline": "the value in the sigignore field of struct task_struct for the process",
    "text-help": "the value in the sigignore field of struct task_struct for the process",
    "pmid": 12636192,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.blocked",
    "text-oneline": "the value in the blocked field of struct task_struct for the process",
    "text-help": "the value in the blocked field of struct task_struct for the process",
    "pmid": 12636191,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.signal",
    "text-oneline": "the value in the signal field of struct task_struct for the process",
    "text-help": "the value in the signal field of struct task_struct for the process",
    "pmid": 12636190,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.eip",
    "text-oneline": "the value in the eip field of struct task_struct for the process",
    "text-help": "the value in the eip field of struct task_struct for the process",
    "pmid": 12636189,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.esp",
    "text-oneline": "the value in the esp field of struct task_struct for the process",
    "text-help": "the value in the esp field of struct task_struct for the process",
    "pmid": 12636188,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.start_stack",
    "text-oneline": "address of the stack segment for the process",
    "text-help": "address of the stack segment for the process",
    "pmid": 12636187,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.end_code",
    "text-oneline": "address of the end of the code segment for the process",
    "text-help": "address of the end of the code segment for the process",
    "pmid": 12636186,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.start_code",
    "text-oneline": "address of the start of the code segment for the process",
    "text-help": "address of the start of the code segment for the process",
    "pmid": 12636185,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.rss_rlim",
    "text-oneline": "limit on resident set size of process",
    "text-help": "limit on resident set size of process",
    "pmid": 12636184,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.rss",
    "text-oneline": "resident set size (i.e. physical memory) of the process",
    "text-help": "resident set size (i.e. physical memory) of the process",
    "pmid": 12636183,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.vsize",
    "text-oneline": "virtual size of the process in Kbytes",
    "text-help": "virtual size of the process in Kbytes",
    "pmid": 12636182,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.start_time",
    "text-oneline": "start time of the process relative to system boot time (in ms)",
    "text-help": "start time of the process relative to system boot time (in ms)",
    "pmid": 12636181,
    "indom": 12582951,
    "sem": "discrete",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.it_real_value",
    "text-oneline": "current interval timer value (zero if none)",
    "text-help": "current interval timer value (zero if none)",
    "pmid": 12636180,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.nice",
    "text-oneline": "process nice value (negative nice values are lower priority)",
    "text-help": "process nice value (negative nice values are lower priority)",
    "pmid": 12636178,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "hotproc.psinfo.priority",
    "text-oneline": "scheduling priority value",
    "text-help": "scheduling priority value",
    "pmid": 12636177,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "32"
  },
  {
    "name": "hotproc.psinfo.cstime",
    "text-oneline": "time (in ms) spent executing system code of all exited children",
    "text-help": "time (in ms) spent executing system code of all exited children",
    "pmid": 12636176,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.cutime",
    "text-oneline": "time (in ms) spent executing user code of all exited children",
    "text-help": "time (in ms) spent executing user code of all exited children",
    "pmid": 12636175,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.stime",
    "text-oneline": "time (in ms) spent executing system code (calls) since process started",
    "text-help": "time (in ms) spent executing system code (calls) since process started",
    "pmid": 12636174,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.utime",
    "text-oneline": "time (in ms) spent executing user code since process started",
    "text-help": "time (in ms) spent executing user code since process started",
    "pmid": 12636173,
    "indom": 12582951,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "hotproc.psinfo.cmaj_flt",
    "text-oneline": "count of page faults other than reclaims of all exited children",
    "text-help": "count of page faults other than reclaims of all exited children",
    "pmid": 12636172,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.maj_flt",
    "text-oneline": "count of page faults other than reclaims",
    "text-help": "count of page faults other than reclaims",
    "pmid": 12636171,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.cmin_flt",
    "text-oneline": "count of minor page faults (i.e. reclaims) of all exited children",
    "text-help": "count of minor page faults (i.e. reclaims) of all exited children",
    "pmid": 12636170,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.minflt",
    "text-oneline": "count of minor page faults (i.e. reclaims)",
    "text-help": "count of minor page faults (i.e. reclaims)",
    "pmid": 12636169,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.flags",
    "text-oneline": "process state flags, as a bitmap",
    "text-help": "process state flags, as a bitmap",
    "pmid": 12636168,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.tty_pgrp",
    "text-oneline": "controlling tty process group identifier",
    "text-help": "controlling tty process group identifier",
    "pmid": 12636167,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.tty",
    "text-oneline": "controlling tty device number (zero if none)",
    "text-help": "controlling tty device number (zero if none)",
    "pmid": 12636166,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.session",
    "text-oneline": "process session identifier",
    "text-help": "process session identifier",
    "pmid": 12636165,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.pgrp",
    "text-oneline": "process group identifier",
    "text-help": "process group identifier",
    "pmid": 12636164,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.ppid",
    "text-oneline": "parent process identifier",
    "text-help": "parent process identifier",
    "pmid": 12636163,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.psinfo.sname",
    "text-oneline": "process state identifier (see ps(1)). See also proc.runq metrics.",
    "text-help": "process state identifier (see ps(1)). See also proc.runq metrics.",
    "pmid": 12636162,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.cmd",
    "text-oneline": "command name",
    "text-help": "command name",
    "pmid": 12636161,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.psinfo.pid",
    "text-oneline": "process identifier",
    "text-help": "process identifier",
    "pmid": 12636160,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmnonlib",
    "text-oneline": "difference between process real memory use (vmreal) and libraries (vmlib)",
    "text-help": "difference between process real memory use (vmreal) and libraries (vmlib)",
    "pmid": 12640300,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "hotproc.memory.vmreal",
    "text-oneline": "sum of resident set size and virtual memory swapped out",
    "text-help": "sum of resident set size and virtual memory swapped out",
    "pmid": 12640299,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "hotproc.memory.vmpte",
    "text-oneline": "memory occupied by page table entries (from /proc/<pid>/status)",
    "text-help": "memory occupied by page table entries (from /proc/<pid>/status)",
    "pmid": 12640292,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmhwm",
    "text-oneline": "peak usage of physical memory (from /proc/<pid>/status)",
    "text-help": "peak usage of physical memory (from /proc/<pid>/status)",
    "pmid": 12640291,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmpin",
    "text-oneline": "fixed physical address unswappable pages (from /proc/<pid>/status)",
    "text-help": "fixed physical address unswappable pages (from /proc/<pid>/status)",
    "pmid": 12640290,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmpeak",
    "text-oneline": "peak virtual memory size (from /proc/<pid>/status)",
    "text-help": "peak virtual memory size (from /proc/<pid>/status)",
    "pmid": 12640289,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmswap",
    "text-oneline": "virtual memory size currently swapped out (from /proc/<pid>/status)",
    "text-help": "virtual memory size currently swapped out (from /proc/<pid>/status)",
    "pmid": 12640283,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmlib",
    "text-oneline": "virtual memory used for libraries (from /proc/<pid>/status)",
    "text-help": "virtual memory used for libraries (from /proc/<pid>/status)",
    "pmid": 12640282,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmexe",
    "text-oneline": "virtual memory used for non-library executable code (from /proc/<pid>/status)",
    "text-help": "virtual memory used for non-library executable code (from /proc/<pid>/status)",
    "pmid": 12640281,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmstack",
    "text-oneline": "virtual memory used for stack (from /proc/<pid>/status)",
    "text-help": "virtual memory used for stack (from /proc/<pid>/status)",
    "pmid": 12640280,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmdata",
    "text-oneline": "virtual memory used for data (from /proc/<pid>/status)",
    "text-help": "virtual memory used for data (from /proc/<pid>/status)",
    "pmid": 12640279,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmrss",
    "text-oneline": "resident virtual memory (from /proc/<pid>/status)",
    "text-help": "resident virtual memory (from /proc/<pid>/status)",
    "pmid": 12640278,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmlock",
    "text-oneline": "locked virtual memory (from /proc/<pid>/status)",
    "text-help": "locked virtual memory (from /proc/<pid>/status)",
    "pmid": 12640277,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.vmsize",
    "text-oneline": "total virtual memory (from /proc/<pid>/status)",
    "text-help": "total virtual memory (from /proc/<pid>/status)",
    "pmid": 12640276,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.maps",
    "text-oneline": "table of memory mapped by process in string form from /proc/<pid>/maps",
    "text-help": "table of memory mapped by process in string form from /proc/<pid>/maps",
    "pmid": 12637191,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.memory.dirty",
    "text-oneline": "instantaneous amount of memory that has been modified by the process, in Kbytes",
    "text-help": "instantaneous amount of memory that has been modified by the process, in Kbytes",
    "pmid": 12637190,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.datrss",
    "text-oneline": "instantaneous resident size of process data segment, in Kbytes",
    "text-help": "instantaneous resident size of process data segment, in Kbytes",
    "pmid": 12637189,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.librss",
    "text-oneline": "instantaneous resident size of library code mapped by the process, in Kbytes",
    "text-help": "instantaneous resident size of library code mapped by the process, in Kbytes",
    "pmid": 12637188,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.textrss",
    "text-oneline": "instantaneous resident size of process code segment in Kbytes",
    "text-help": "instantaneous resident size of process code segment in Kbytes",
    "pmid": 12637187,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.share",
    "text-oneline": "instantaneous amount of memory shared by this process with other processes ",
    "text-help": "instantaneous amount of memory shared by this process with other processes ",
    "pmid": 12637186,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.rss",
    "text-oneline": "instantaneous resident size of process, excluding page table and task structure.",
    "text-help": "instantaneous resident size of process, excluding page table and task structure.",
    "pmid": 12637185,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.memory.size",
    "text-oneline": "instantaneous virtual size of process, excluding page table and task structure.",
    "text-help": "instantaneous virtual size of process, excluding page table and task structure.",
    "pmid": 12637184,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.id.container",
    "text-oneline": "name of processes container (from /proc/<pid>/cgroup heuristics)",
    "text-help": "name of processes container (from /proc/<pid>/cgroup heuristics)",
    "pmid": 12638209,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.fsgid_nm",
    "text-oneline": "filesystem group name based on filesystem group ID from /proc/<pid>/status",
    "text-help": "filesystem group name based on filesystem group ID from /proc/<pid>/status",
    "pmid": 12640271,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.sgid_nm",
    "text-oneline": "saved group name based on saved group ID from /proc/<pid>/status",
    "text-help": "saved group name based on saved group ID from /proc/<pid>/status",
    "pmid": 12640270,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.egid_nm",
    "text-oneline": "effective group name based on effective group ID from /proc/<pid>/status",
    "text-help": "effective group name based on effective group ID from /proc/<pid>/status",
    "pmid": 12640269,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.gid_nm",
    "text-oneline": "real group name based on real group ID from /proc/<pid>/status",
    "text-help": "real group name based on real group ID from /proc/<pid>/status",
    "pmid": 12640268,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.fsuid_nm",
    "text-oneline": "filesystem user name based on filesystem user ID from /proc/<pid>/status",
    "text-help": "filesystem user name based on filesystem user ID from /proc/<pid>/status",
    "pmid": 12640267,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.suid_nm",
    "text-oneline": "saved user name based on saved user ID from /proc/<pid>/status",
    "text-help": "saved user name based on saved user ID from /proc/<pid>/status",
    "pmid": 12640266,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.euid_nm",
    "text-oneline": "effective user name based on effective user ID from /proc/<pid>/status",
    "text-help": "effective user name based on effective user ID from /proc/<pid>/status",
    "pmid": 12640265,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.uid_nm",
    "text-oneline": "real user name based on real user ID from /proc/<pid>/status",
    "text-help": "real user name based on real user ID from /proc/<pid>/status",
    "pmid": 12640264,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.id.fsgid",
    "text-oneline": "filesystem group ID from /proc/<pid>/status",
    "text-help": "filesystem group ID from /proc/<pid>/status",
    "pmid": 12640263,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.sgid",
    "text-oneline": "saved group ID from /proc/<pid>/status",
    "text-help": "saved group ID from /proc/<pid>/status",
    "pmid": 12640262,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.egid",
    "text-oneline": "effective group ID from /proc/<pid>/status",
    "text-help": "effective group ID from /proc/<pid>/status",
    "pmid": 12640261,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.gid",
    "text-oneline": "real group ID from /proc/<pid>/status",
    "text-help": "real group ID from /proc/<pid>/status",
    "pmid": 12640260,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.fsuid",
    "text-oneline": "filesystem user ID from /proc/<pid>/status",
    "text-help": "filesystem user ID from /proc/<pid>/status",
    "pmid": 12640259,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.suid",
    "text-oneline": "saved user ID from /proc/<pid>/status",
    "text-help": "saved user ID from /proc/<pid>/status",
    "pmid": 12640258,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.euid",
    "text-oneline": "effective user ID from /proc/<pid>/status",
    "text-help": "effective user ID from /proc/<pid>/status",
    "pmid": 12640257,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.id.uid",
    "text-oneline": "real user ID from /proc/<pid>/status",
    "text-help": "real user ID from /proc/<pid>/status",
    "pmid": 12640256,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.io.cancelled_write_bytes",
    "text-oneline": "physical device write cancelled bytes",
    "text-help": "Number of bytes cancelled via truncate by this process.  Actual physical\nwrites for an individual process can be calculated as:\n\tproc.io.write_bytes - proc.io.cancelled_write_bytes.\n",
    "pmid": 12642310,
    "indom": 12582951,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "hotproc.io.write_bytes",
    "text-oneline": "physical device write bytes",
    "text-help": "Number of bytes physically written to devices on behalf of this process.\nThis must be reduced by any truncated I/O (proc.io.cancelled_write_bytes).\n",
    "pmid": 12642309,
    "indom": 12582951,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "hotproc.io.read_bytes",
    "text-oneline": "physical device read bytes",
    "text-help": "Number of bytes physically read on by devices on behalf of this process.\n",
    "pmid": 12642308,
    "indom": 12582951,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "hotproc.io.syscw",
    "text-oneline": "write(), writev() and sendfile() send system calls",
    "text-help": "Extended accounting information - count of number of calls to the\nwrite(2), writev(2) and sendfile(2) syscalls by each process.\n",
    "pmid": 12642307,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "hotproc.io.syscr",
    "text-oneline": "read(), readv() and sendfile() receive system calls",
    "text-help": "Extended accounting information - count of number of calls to the\nread(2), readv(2) and sendfile(2) syscalls by each process.\n",
    "pmid": 12642306,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "hotproc.io.wchar",
    "text-oneline": "write(), writev() and sendfile() send bytes",
    "text-help": "Extended accounting information - count of the number of bytes that\nhave passed over the write(2), writev(2) and sendfile(2) syscalls by\neach process.\n",
    "pmid": 12642305,
    "indom": 12582951,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "hotproc.io.rchar",
    "text-oneline": "read(), readv() and sendfile() receive bytes",
    "text-help": "Extended accounting information - count of the number of bytes that\nhave passed over the read(2), readv(2) and sendfile(2) syscalls by\neach process.\n",
    "pmid": 12642304,
    "indom": 12582951,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "hotproc.schedstat.pcount",
    "text-oneline": "number of times a process is allowed to run",
    "text-help": "Number of times a process has been scheduled to run on a CPU (this is\nincremented when a task actually reaches a CPU to run on, not simply\nwhen it is added to the run queue).\n",
    "pmid": 12641282,
    "indom": 12582951,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "hotproc.schedstat.run_delay",
    "text-oneline": "run queue time",
    "text-help": "Length of time in nanoseconds that a process spent waiting to be scheduled\nto run in the run queue.\n",
    "pmid": 12641281,
    "indom": 12582951,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "hotproc.schedstat.cpu_time",
    "text-oneline": "runnable (scheduled) + run time",
    "text-help": "Length of time in nanoseconds that a process has been running, including\nscheduling time.\n",
    "pmid": 12641280,
    "indom": 12582951,
    "sem": "counter",
    "units": "nanosec",
    "type": "U64"
  },
  {
    "name": "hotproc.fd.count",
    "text-oneline": "open file descriptors",
    "text-help": "Number of file descriptors this process has open.\n",
    "pmid": 12643328,
    "indom": 12582951,
    "sem": "instant",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "hotproc.namespaces.envid",
    "text-oneline": "OpenVZ container identifier",
    "text-help": "OpenVZ container identifier",
    "pmid": 12640298,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.namespaces.sid",
    "text-oneline": "descendant namespace session ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace session ID hierarchy (/proc/<pid>/status)",
    "pmid": 12640296,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.namespaces.pgid",
    "text-oneline": "descendant namespace process group ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace process group ID hierarchy (/proc/<pid>/status)",
    "pmid": 12640295,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.namespaces.pid",
    "text-oneline": "descendant namespace process ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace process ID hierarchy (/proc/<pid>/status)",
    "pmid": 12640294,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.namespaces.tgid",
    "text-oneline": "descendant namespace thread group ID hierarchy (/proc/<pid>/status)",
    "text-help": "descendant namespace thread group ID hierarchy (/proc/<pid>/status)",
    "pmid": 12640293,
    "indom": 12582951,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.control.refresh",
    "text-oneline": "time in secs between refreshes",
    "text-help": "Controls how long it takes before the \"interesting\" process list is refreshed\nand new cpuburn times (see hotproc.cpuburn) calculated.  This value can be\nchanged at any time by using pmstore(1). Once the value is changed, the instances\nwill not be available until after the new refresh period has elapsed.",
    "pmid": 12644353,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.control.config",
    "text-oneline": "configuration predicate",
    "text-help": "The configuration predicate that is used to characterize \"interesting\"\nprocesses.  This will initially be the predicate as specified in the\nconfiguration file.  This value can be changed at any time by using\npmstore(1).  Once the value is changed, the instances will not be available\nuntil after the refresh period has elapsed.",
    "pmid": 12644360,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "hotproc.control.config_gen",
    "text-oneline": "configuration generation number",
    "text-help": "Each time the configuration predicate is updated (see hotproc.control.config)\nthe configuration generation number is incremented.",
    "pmid": 12644361,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.control.reload_config",
    "text-oneline": "force the config file to be reloaded",
    "text-help": "Instructs the pmda to reload its configuration file.  This value can be\nchanged at any time by using pmstore(1). Once the value is changed, the instances\nwill not be available until after the new refresh period has elapsed.",
    "pmid": 12644362,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "hotproc.total.cpuidle",
    "text-oneline": "fraction of CPU idle time",
    "text-help": "The fraction of all CPU time classified as idle over the last refresh\ninterval.",
    "pmid": 12644354,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.total.cpuburn",
    "text-oneline": "total amount of cpuburn over all \"interesting\" processes",
    "text-help": "The sum of the CPU utilization (\"cpuburn\" or the fraction of time that each\nprocess was executing in user or system mode over the last refresh interval)\nfor all the \"interesting\" processes.\n\nValues are in the range 0 to the number of CPUs.",
    "pmid": 12644355,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.total.cpuother.transient",
    "text-oneline": "fraction of time utilized by \"transient\" processes",
    "text-help": "The total CPU utilization (fraction of time that each process was executing\nin user or system mode) for processes which are not present throughout\nthe most recent refreshes interval.  The hotproc PMDA is limited to\nselecting processes which are present throughout each refresh intervals.\nIf processes come and/or go during a refresh interval then they will never\nbe considered.  This metric gives an indication of the level of activity of\nthese \"transient\" processes.  If the value is large in comparison to the\nsum of hotproc.total.cpuburn and hotproc.total.cpuother.not_cpuburn then\nthe \"transient\" processes are consuming lots of CPU time.  Under these\ncircumstances, the hotproc PMDA may be less useful, or consideration\nshould be given to decreasing the value of the refresh interval\n(hotproc.control.refresh) so fewer \"transient\" processes escape\nconsideration.\n\nValues are in the range 0 to the number of CPUs.",
    "pmid": 12644356,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.total.cpuother.not_cpuburn",
    "text-oneline": "total amount of cpuburn over all uninteresting processes",
    "text-help": "The sum of the CPU utilization (\"cpuburn\" or the fraction of time that\neach process was executing in user or system mode over the last refresh\ninterval) for all the \"uninteresting\" processes.  If this value is high in\ncomparison to hotproc.total.cpuburn, then configuration predicate of the\nhotproc PMDA is classifying a significant fraction of the CPU utilization\nto processes that are not \"interesting\".\n\nValues are in the range 0 to the number of CPUs.",
    "pmid": 12644357,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.total.cpuother.total",
    "text-oneline": "total amount of cpuburn other than the \"interesting\" processes",
    "text-help": "Non-idle CPU utilization not accounted for by processes other than those\ndeemed \"interesting\".  It is equivalent to hotproc.total.cpuother.not_cpuburn\n+ hotproc.total.cpuother.transient.\n\nValues are in the range 0 to the number of CPUs.",
    "pmid": 12644358,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.total.cpuother.percent",
    "text-oneline": "how much of the cpu for \"transients\" and uninterestings",
    "text-help": "Gives an indication of how much of the CPU time the \"transient\" processes\nand the \"uninteresting\" processes are accounting for.  Computed as:\n    100 * hotproc.total.cpuother.total / number of CPUs",
    "pmid": 12644359,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.predicate.ctxswitch",
    "text-oneline": "number of context switches per second over refresh interval",
    "text-help": "The number of context switches per second over the last refresh interval\nfor each \"interesting\" process.",
    "pmid": 12645377,
    "indom": 12582951,
    "sem": "instant",
    "units": "count / sec",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.predicate.virtualsize",
    "text-oneline": "virtual size of process in kilobytes at last refresh",
    "text-help": "The virtual size of each \"interesting\" process in kilobytes at the last\nrefresh time.",
    "pmid": 12645378,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.predicate.residentsize",
    "text-oneline": "resident size of process in kilobytes at last refresh",
    "text-help": "The resident size of each \"interesting\" process in kilobytes at the last\nrefresh.",
    "pmid": 12645379,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "hotproc.predicate.iodemand",
    "text-oneline": "total kilobytes read and written per second over refresh interval",
    "text-help": "The total kilobytes read and written per second over the last refresh\ninterval for each \"interesting\" process.",
    "pmid": 12645380,
    "indom": 12582951,
    "sem": "instant",
    "units": "Kbyte / sec",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.predicate.iowait",
    "text-oneline": "time in secs waiting for I/O per second over refresh interval",
    "text-help": "The fraction of time waiting for I/O for each \"interesting\" process over\nrefresh interval.",
    "pmid": 12645381,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.predicate.schedwait",
    "text-oneline": "time in secs waiting on run queue per second over refresh interval",
    "text-help": "The fraction of time waiting on the run queue for each \"interesting\"\nprocess over the last refresh interval.",
    "pmid": 12645382,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "hotproc.predicate.cpuburn",
    "text-oneline": "CPU utilization per \"interesting\" process",
    "text-help": "CPU utilization, or the fraction of time that each \"interesting\" process\nwas executing (user and system time) over the last refresh interval.\nAlso known as the \"cpuburn\" time.",
    "pmid": 12645383,
    "indom": 12582951,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "containers.engine",
    "text-oneline": "technology backing each container (e.g. docker)",
    "text-help": "technology backing each container (e.g. docker)",
    "pmid": 4194304,
    "indom": 4194304,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "containers.name",
    "text-oneline": "mapping of unique container IDs to human-readable names",
    "text-help": "mapping of unique container IDs to human-readable names",
    "pmid": 4194305,
    "indom": 4194304,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "containers.pid",
    "text-oneline": "process identifier for each containers initial process",
    "text-help": "process identifier for each containers initial process",
    "pmid": 4194306,
    "indom": 4194304,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "containers.cgroup",
    "text-oneline": "path mapping container names to their cgroups",
    "text-help": "path mapping container names to their cgroups",
    "pmid": 4194310,
    "indom": 4194304,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "containers.state.running",
    "text-oneline": "this container is currently running (one/zero)",
    "text-help": "this container is currently running (one/zero)",
    "pmid": 4194307,
    "indom": 4194304,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "containers.state.paused",
    "text-oneline": "this container is currently paused (one/zero)",
    "text-help": "this container is currently paused (one/zero)",
    "pmid": 4194308,
    "indom": 4194304,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "containers.state.restarting",
    "text-oneline": "this container is restarting (one/zero)",
    "text-help": "this container is restarting (one/zero)",
    "pmid": 4194309,
    "indom": 4194304,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "xfs.write",
    "text-oneline": "number of XFS file system write operations",
    "text-help": "This is the number of write(2) system calls made to files in\nXFS file systems.",
    "pmid": 46153779,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.write_bytes",
    "text-oneline": "number of bytes written in XFS file system write operations",
    "text-help": "This is the number of bytes written via write(2) system calls to files\nin XFS file systems. It can be used in conjunction with the write_calls\ncount to calculate the average size of the write operations to files in\nXFS file systems.",
    "pmid": 46153780,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.read",
    "text-oneline": "number of XFS file system read operations",
    "text-help": "This is the number of read(2) system calls made to files in XFS file\nsystems.",
    "pmid": 46153781,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.read_bytes",
    "text-oneline": "number of bytes read in XFS file system read operations",
    "text-help": "This is the number of bytes read via read(2) system calls to files in\nXFS file systems. It can be used in conjunction with the read_calls\ncount to calculate the average size of the read operations to files in\nXFS file systems.",
    "pmid": 46153782,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.iflush_count",
    "text-oneline": "the number of calls to xfs_iflush",
    "text-help": "This is the number of calls to xfs_iflush which gets called when an\ninode is being flushed (such as by bdflush or tail pushing).\nxfs_iflush searches for other inodes in the same cluster which are\ndirty and flushable.",
    "pmid": 46153795,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.icluster_flushcnt",
    "text-oneline": "value from xs_icluster_flushcnt field of struct xfsstats",
    "text-help": "value from xs_icluster_flushcnt field of struct xfsstats",
    "pmid": 46153796,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.icluster_flushinode",
    "text-oneline": "number of flushes of only one inode in cluster",
    "text-help": "This is the number of times that the inode clustering was not able to\nflush anything but the one inode it was called with.",
    "pmid": 46153797,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.allocs.alloc_extent",
    "text-oneline": "XFS extents allocated",
    "text-help": "Number of file system extents allocated over XFS filesystems",
    "pmid": 46153728,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.allocs.alloc_block",
    "text-oneline": "XFS blocks allocated",
    "text-help": "Number of file system blocks allocated over XFS filesystems",
    "pmid": 46153729,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.allocs.free_extent",
    "text-oneline": "XFS extents freed",
    "text-help": "Number of file system extents freed over XFS filesystems",
    "pmid": 46153730,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.allocs.free_block",
    "text-oneline": "XFS blocks freed",
    "text-help": "Number of file system blocks freed over XFS filesystems",
    "pmid": 46153731,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.alloc_btree.lookup",
    "text-oneline": "lookups in XFS alloc btrees",
    "text-help": "Number of lookup operations in XFS filesystem allocation btrees",
    "pmid": 46153732,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.alloc_btree.compare",
    "text-oneline": "compares in XFS alloc btrees",
    "text-help": "Number of compares in XFS filesystem allocation btree lookups",
    "pmid": 46153733,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.alloc_btree.insrec",
    "text-oneline": "insertions in XFS alloc btrees",
    "text-help": "Number of extent records inserted into XFS filesystem allocation btrees",
    "pmid": 46153734,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.alloc_btree.delrec",
    "text-oneline": "deletions in XFS alloc btrees",
    "text-help": "Number of extent records deleted from XFS filesystem allocation btrees",
    "pmid": 46153735,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.read_ops",
    "text-oneline": "block map read ops in XFS",
    "text-help": "Number of block map for read operations performed on XFS files",
    "pmid": 46153736,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.write_ops",
    "text-oneline": "block map write ops in XFS",
    "text-help": "Number of block map for write operations performed on XFS files",
    "pmid": 46153737,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.unmap",
    "text-oneline": "block unmap ops in XFS",
    "text-help": "Number of block unmap (delete) operations performed on XFS files",
    "pmid": 46153738,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.add_exlist",
    "text-oneline": "extent list add ops in XFS",
    "text-help": "Number of extent list insertion operations for XFS files",
    "pmid": 46153739,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.del_exlist",
    "text-oneline": "extent list delete ops in XFS",
    "text-help": "Number of extent list deletion operations for XFS files",
    "pmid": 46153740,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.look_exlist",
    "text-oneline": "extent list lookup ops in XFS",
    "text-help": "Number of extent list lookup operations for XFS files",
    "pmid": 46153741,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.block_map.cmp_exlist",
    "text-oneline": "extent list compare ops in XFS",
    "text-help": "Number of extent list comparisons in XFS extent list lookups",
    "pmid": 46153742,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.bmap_btree.lookup",
    "text-oneline": "block map btree lookup ops in XFS",
    "text-help": "Number of block map btree lookup operations on XFS files",
    "pmid": 46153743,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.bmap_btree.compare",
    "text-oneline": "block map btree compare ops in XFS",
    "text-help": "Number of block map btree compare operations in XFS block map lookups",
    "pmid": 46153744,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.bmap_btree.insrec",
    "text-oneline": "block map btree insert ops in XFS",
    "text-help": "Number of block map btree records inserted for XFS files",
    "pmid": 46153745,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.bmap_btree.delrec",
    "text-oneline": "block map btree delete ops in XFS",
    "text-help": "Number of block map btree records deleted for XFS files",
    "pmid": 46153746,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.dir_ops.lookup",
    "text-oneline": "number of file name directory lookups",
    "text-help": "This is a count of the number of file name directory lookups in XFS\nfilesystems. It counts only those lookups which miss in the operating\nsystem's directory name lookup cache and must search the real directory\nstructure for the name in question.  The count is incremented once for\neach level of a pathname search that results in a directory lookup.",
    "pmid": 46153747,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.dir_ops.create",
    "text-oneline": "number of directory entry creation operations",
    "text-help": "This is the number of times a new directory entry was created in XFS\nfilesystems. Each time that a new file, directory, link, symbolic link,\nor special file is created in the directory hierarchy the count is\nincremented.",
    "pmid": 46153748,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.dir_ops.remove",
    "text-oneline": "number of directory entry remove operations",
    "text-help": "This is the number of times an existing directory entry was removed in\nXFS filesystems. Each time that a file, directory, link, symbolic link,\nor special file is removed from the directory hierarchy the count is\nincremented.",
    "pmid": 46153749,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.dir_ops.getdents",
    "text-oneline": "number of times the getdents operation is performed",
    "text-help": "This is the number of times the XFS directory getdents operation was\nperformed. The getdents operation is used by programs to read the\ncontents of directories in a file system independent fashion.  This\ncount corresponds exactly to the number of times the getdents(2) system\ncall was successfully used on an XFS directory.",
    "pmid": 46153750,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.transactions.sync",
    "text-oneline": "number of synchronous meta-data transactions performed",
    "text-help": "This is the number of meta-data transactions which waited to be\ncommitted to the on-disk log before allowing the process performing the\ntransaction to continue. These transactions are slower and more\nexpensive than asynchronous transactions, because they force the in\nmemory log buffers to be forced to disk more often and they wait for\nthe completion of the log buffer writes.",
    "pmid": 46153751,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.transactions.async",
    "text-oneline": "number of asynchronous meta-data transactions performed",
    "text-help": "This is the number of meta-data transactions which did not wait to be\ncommitted to the on-disk log before allowing the process performing the\ntransaction to continue. These transactions are faster and more\nefficient than synchronous transactions, because they commit their data\nto the in memory log buffers without forcing those buffers to be\nwritten to disk. This allows multiple asynchronous transactions to be\ncommitted to disk in a single log buffer write. Most transactions used\nin XFS file systems are asynchronous.",
    "pmid": 46153752,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.transactions.empty",
    "text-oneline": "number of meta-data transactions which committed without changing anything",
    "text-help": "This is the number of meta-data transactions which did not actually\nchange anything. These are transactions which were started for some\npurpose, but in the end it turned out that no change was necessary.",
    "pmid": 46153753,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_attempts",
    "text-oneline": "number of in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache. Whether the inode was found in the cache or\nneeded to be read in from the disk is not indicated here, but this can\nbe computed from the ig_found and ig_missed counts.",
    "pmid": 46153754,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_found",
    "text-oneline": "number of successful in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and found it. The closer this count is to the\nig_attempts count the better the inode cache is performing.",
    "pmid": 46153755,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_frecycle",
    "text-oneline": "number of just missed in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and saw that it was there but was unable to\nuse the in memory inode because it was being recycled by another\nprocess.",
    "pmid": 46153756,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_missed",
    "text-oneline": "number of failed in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and the inode was not there. The further this\ncount is from the ig_attempts count the better.",
    "pmid": 46153757,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_dup",
    "text-oneline": "number of inode cache insertions that fail because the inode is there",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and found that it was not there but upon\nattempting to add the inode to the cache found that another process had\nalready inserted it.",
    "pmid": 46153758,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_reclaims",
    "text-oneline": "number of in memory inode recycle operations",
    "text-help": "This is the number of times the operating system recycled an XFS inode\nfrom the inode cache in order to use the memory for that inode for\nanother purpose. Inodes are recycled in order to keep the inode cache\nfrom growing without bound. If the reclaim rate is high it may be\nbeneficial to raise the vnode_free_ratio kernel tunable variable to\nincrease the size of inode cache.",
    "pmid": 46153759,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.inode_ops.ig_attrchg",
    "text-oneline": "number of inode attribute change operations",
    "text-help": "This is the number of times the operating system explicitly changed the\nattributes of an XFS inode. For example, this could be to change the\ninode's owner, the inode's size, or the inode's timestamps.",
    "pmid": 46153760,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log.writes",
    "text-oneline": "number of buffer writes going to the disk from the log",
    "text-help": "This variable counts the number of log buffer writes going to the\nphysical log partitions of XFS filesystems. Log data traffic is\nproportional to the level of meta-data updating. Log buffer writes get\ngenerated when they fill up or external syncs occur.",
    "pmid": 46153761,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log.blocks",
    "text-oneline": "write throughput to the physical XFS log",
    "text-help": "This variable counts the number of Kbytes of information being written\nto the physical log partitions of XFS filesystems. Log data traffic\nis proportional to the level of meta-data updating. The rate with which\nlog data gets written depends on the size of internal log buffers and\ndisk write speed. Therefore, filesystems with very high meta-data\nupdating may need to stripe the log partition or put the log partition\non a separate drive.",
    "pmid": 46153762,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "xfs.log.write_ratio",
    "text-oneline": "ratio of count of XFS log blocks written to log writes",
    "text-help": "The ratio of log blocks written to log writes.  If block count isn't a\n\"reasonable\" multiple of writes, then many small log writes are being\nperformed - this is suboptimal.  Perfection is 64.  Fine-grain control\ncan be obtained when this metric is used in conjuntion with pmstore(1)\nand the xfs.control.reset metric.",
    "pmid": 46153806,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "xfs.log.noiclogs",
    "text-oneline": "count of failures for immediate get of buffered/internal",
    "text-help": "This variable keeps track of times when a logged transaction can not\nget any log buffer space. When this occurs, all of the internal log\nbuffers are busy flushing their data to the physical on-disk log.",
    "pmid": 46153763,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log.force",
    "text-oneline": "value from xs_log_force field of struct xfsstats",
    "text-help": "The number of times the in-core log is forced to disk.  It is\nequivalent to the number of successful calls to the function\nxfs_log_force().",
    "pmid": 46153764,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log.force_sleep",
    "text-oneline": "value from xs_log_force_sleep field of struct xfsstats",
    "text-help": "This metric is exported from the xs_log_force_sleep field of struct xfsstats",
    "pmid": 46153765,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.try_logspace",
    "text-oneline": "value from xs_try_logspace field of struct xfsstats",
    "text-help": "This metric is exported from the xs_try_logspace field of struct xfsstats",
    "pmid": 46153766,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.sleep_logspace",
    "text-oneline": "value from xs_sleep_logspace field of struct xfsstats",
    "text-help": "This metric is exported from the xs_sleep_logspace field of struct xfsstats",
    "pmid": 46153767,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.pushes",
    "text-oneline": "number of times the AIL tail is moved forward",
    "text-help": "The number of times the tail of the AIL is moved forward.  It is\nequivalent to the number of successful calls to the function\nxfs_trans_push_ail().",
    "pmid": 46153768,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.success",
    "text-oneline": "value from xs_push_ail_success field of struct xfsstats",
    "text-help": "value from xs_push_ail_success field of struct xfsstats",
    "pmid": 46153769,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.pushbuf",
    "text-oneline": "value from xs_push_ail_pushbuf field of struct xfsstats",
    "text-help": "value from xs_push_ail_pushbuf field of struct xfsstats",
    "pmid": 46153770,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.pinned",
    "text-oneline": "value from xs_push_ail_pinned field of struct xfsstats",
    "text-help": "value from xs_push_ail_pinned field of struct xfsstats",
    "pmid": 46153771,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.locked",
    "text-oneline": "value from xs_push_ail_locked field of struct xfsstats",
    "text-help": "value from xs_push_ail_locked field of struct xfsstats",
    "pmid": 46153772,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.flushing",
    "text-oneline": "value from xs_push_ail_flushing field of struct xfsstats",
    "text-help": "value from xs_push_ail_flushing field of struct xfsstats",
    "pmid": 46153773,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.restarts",
    "text-oneline": "value from xs_push_ail_restarts field of struct xfsstats",
    "text-help": "value from xs_push_ail_restarts field of struct xfsstats",
    "pmid": 46153774,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.log_tail.push_ail.flush",
    "text-oneline": "value from xs_push_ail_flush field of struct xfsstats",
    "text-help": "value from xs_push_ail_flush field of struct xfsstats",
    "pmid": 46153775,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.xstrat.bytes",
    "text-oneline": "number of bytes of data processed by the XFS daemons",
    "text-help": "This is the number of bytes of file data flushed out by the XFS\nflushing daemons.",
    "pmid": 46153776,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.xstrat.quick",
    "text-oneline": "number of buffers processed by the XFS daemons written to contiguous space on disk",
    "text-help": "This is the number of buffers flushed out by the XFS flushing daemons\nwhich are written to contiguous space on disk. The buffers handled by\nthe XFS daemons are delayed allocation buffers, so this count gives an\nindication of the success of the XFS daemons in allocating contiguous\ndisk space for the data being flushed to disk.",
    "pmid": 46153777,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.xstrat.split",
    "text-oneline": "number of buffers processed by the XFS daemons written to non-contiguous space on disk",
    "text-help": "This is the number of buffers flushed out by the XFS flushing daemons\nwhich are written to non-contiguous space on disk. The buffers handled\nby the XFS daemons are delayed allocation buffers, so this count gives\nan indication of the failure of the XFS daemons in allocating\ncontiguous disk space for the data being flushed to disk. Large values\nin this counter indicate that the file system has become fragmented.",
    "pmid": 46153778,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.attr.get",
    "text-oneline": "number of \"get\" operations on XFS extended file attributes",
    "text-help": "The number of \"get\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"get\" operation retrieves the value of an\nextended attribute.",
    "pmid": 46153783,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.attr.set",
    "text-oneline": "number of \"set\" operations on XFS extended file attributes",
    "text-help": "The number of \"set\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"set\" operation creates and sets the value\nof an extended attribute.",
    "pmid": 46153784,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.attr.remove",
    "text-oneline": "number of \"remove\" operations on XFS extended file attributes",
    "text-help": "The number of \"remove\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"remove\" operation deletes an extended\nattribute.",
    "pmid": 46153785,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.attr.list",
    "text-oneline": "number of \"list\" operations on XFS extended file attributes",
    "text-help": "The number of \"list\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"list\" operation retrieves the set of\nextended attributes associated with a file.",
    "pmid": 46153786,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.reclaims",
    "text-oneline": "value from xs_qm_dqreclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqreclaims field of struct xfsstats",
    "pmid": 46153787,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.reclaim_misses",
    "text-oneline": "value from xs_qm_dqreclaim_misses field of struct xfsstats",
    "text-help": "value from xs_qm_dqreclaim_misses field of struct xfsstats",
    "pmid": 46153788,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.dquot_dups",
    "text-oneline": "value from xs_qm_dquot_dups field of struct xfsstats",
    "text-help": "value from xs_qm_dquot_dups field of struct xfsstats",
    "pmid": 46153789,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.cachemisses",
    "text-oneline": "value from xs_qm_dqcachemisses field of struct xfsstats",
    "text-help": "value from xs_qm_dqcachemisses field of struct xfsstats",
    "pmid": 46153790,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.cachehits",
    "text-oneline": "value from xs_qm_dqcachehits field of struct xfsstats",
    "text-help": "value from xs_qm_dqcachehits field of struct xfsstats",
    "pmid": 46153791,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.wants",
    "text-oneline": "value from xs_qm_dqwants field of struct xfsstats",
    "text-help": "value from xs_qm_dqwants field of struct xfsstats",
    "pmid": 46153792,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.shake_reclaims",
    "text-oneline": "value from xs_qm_dqshake_reclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqshake_reclaims field of struct xfsstats",
    "pmid": 46153793,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.quota.inact_reclaims",
    "text-oneline": "value from xs_qm_dqinact_reclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqinact_reclaims field of struct xfsstats",
    "pmid": 46153794,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.get",
    "text-oneline": "number of request buffer calls",
    "text-help": "number of request buffer calls",
    "pmid": 46154752,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.create",
    "text-oneline": "number of buffers created",
    "text-help": "number of buffers created",
    "pmid": 46154753,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.get_locked",
    "text-oneline": "number of requests for a locked buffer which succeeded",
    "text-help": "number of requests for a locked buffer which succeeded",
    "pmid": 46154754,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.get_locked_waited",
    "text-oneline": "number of requests for a locked buffer which waited",
    "text-help": "number of requests for a locked buffer which waited",
    "pmid": 46154755,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.busy_locked",
    "text-oneline": "number of non-blocking requests for a locked buffer which failed",
    "text-help": "number of non-blocking requests for a locked buffer which failed",
    "pmid": 46154756,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.miss_locked",
    "text-oneline": "number of requests for a locked buffer which failed due to no buffer",
    "text-help": "number of requests for a locked buffer which failed due to no buffer",
    "pmid": 46154757,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.page_retries",
    "text-oneline": "number of retry attempts when allocating a page for insertion in a buffer",
    "text-help": "number of retry attempts when allocating a page for insertion in a buffer",
    "pmid": 46154758,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.page_found",
    "text-oneline": "number of hits in the page cache when looking for a page",
    "text-help": "number of hits in the page cache when looking for a page",
    "pmid": 46154759,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.buffer.get_read",
    "text-oneline": "number of buffer get calls requiring immediate device reads",
    "text-help": "number of buffer get calls requiring immediate device reads",
    "pmid": 46154760,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.active",
    "text-oneline": "number of vnodes not on free lists",
    "text-help": "number of vnodes not on free lists",
    "pmid": 46153798,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.alloc",
    "text-oneline": "number of times vn_alloc called",
    "text-help": "number of times vn_alloc called",
    "pmid": 46153799,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.get",
    "text-oneline": "number of times vn_get called",
    "text-help": "number of times vn_get called",
    "pmid": 46153800,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.hold",
    "text-oneline": "number of times vn_hold called",
    "text-help": "number of times vn_hold called",
    "pmid": 46153801,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.rele",
    "text-oneline": "number of times vn_rele called",
    "text-help": "number of times vn_rele called",
    "pmid": 46153802,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.reclaim",
    "text-oneline": "number of times vn_reclaim called",
    "text-help": "number of times vn_reclaim called",
    "pmid": 46153803,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.remove",
    "text-oneline": "number of times vn_remove called",
    "text-help": "number of times vn_remove called",
    "pmid": 46153804,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.vnodes.free",
    "text-oneline": "number of times vn_free called",
    "text-help": "number of times vn_free called",
    "pmid": 46153805,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.control.reset",
    "text-oneline": "reset the values of all XFS metrics to zero",
    "text-help": "reset the values of all XFS metrics to zero",
    "pmid": 46153807,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.lookup",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree record lookups",
    "pmid": 46153808,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.compare",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree record compares",
    "pmid": 46153809,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.insrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree insert record operations executed",
    "pmid": 46153810,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.delrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree delete record operations executed",
    "pmid": 46153811,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to a free-space-by-block-number btree",
    "pmid": 46153812,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from a free-space-by-block-number btree",
    "pmid": 46153813,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.increment",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved forward one free-space-by-block-number\nbtree record",
    "pmid": 46153814,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.decrement",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved backward one free-space-by-block-number\nbtree record",
    "pmid": 46153815,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46153816,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46153817,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46153818,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting free-space-by-block-number btree records",
    "pmid": 46153819,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during free-space-by-block-number btree operations",
    "pmid": 46153820,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during free-space-by-block-number btree operations",
    "pmid": 46153821,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_blocks.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during free-space-by-block-number btree operations",
    "pmid": 46153822,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.lookup",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree record lookups",
    "pmid": 46153823,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.compare",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree btree record compares",
    "pmid": 46153824,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.insrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree insert record operations executed",
    "pmid": 46153825,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.delrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree delete record operations executed",
    "pmid": 46153826,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to a free-space-by-size btree tree",
    "pmid": 46153827,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from a free-space-by-size btree tree",
    "pmid": 46153828,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.increment",
    "text-oneline": "",
    "text-help": "Number of times a free-space-by-size btree cursor has been moved forward\none record",
    "pmid": 46153829,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.decrement",
    "text-oneline": "",
    "text-help": "Number of times a free-space-by-size btree cursor has been moved backward\none record",
    "pmid": 46153830,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new free-space-by-size\nbtree record",
    "pmid": 46153831,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new free-space-by-size\nbtree record",
    "pmid": 46153832,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new free-space-by-size btree\nrecord",
    "pmid": 46153833,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting free-space-by-size btree records",
    "pmid": 46153834,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during free-space-by-size btree operations",
    "pmid": 46153835,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during free-space-by-size btree operations",
    "pmid": 46153836,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.alloc_contig.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during free-space-by-size btree operations",
    "pmid": 46153837,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.lookup",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree record lookups",
    "pmid": 46153838,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.compare",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree record compares",
    "pmid": 46153839,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.insrec",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree insert record operations executed",
    "pmid": 46153840,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.delrec",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree delete record operations executed",
    "pmid": 46153841,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to an inode-block-map/extent btree",
    "pmid": 46153842,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from an inode-block-map/extent btree",
    "pmid": 46153843,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.increment",
    "text-oneline": "",
    "text-help": "Number of times an inode-block-map/extent btree cursor has been moved\nforward one record",
    "pmid": 46153844,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.decrement",
    "text-oneline": "",
    "text-help": "Number of times an inode-block-map/extent btree cursor has been moved\nbackward one record",
    "pmid": 46153845,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46153846,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46153847,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46153848,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting inode-block-map/extent btree records",
    "pmid": 46153849,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during inode-block-map/extent btree operations",
    "pmid": 46153850,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during inode-block-map/extent btree operations",
    "pmid": 46153851,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.block_map.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during inode-block-map/extent btree operations",
    "pmid": 46153852,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.lookup",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree record lookups",
    "pmid": 46153853,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.compare",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree record compares",
    "pmid": 46153854,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.insrec",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree insert record operations executed",
    "pmid": 46153855,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.delrec",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree delete record operations executed",
    "pmid": 46153856,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to an inode-allocation btree",
    "pmid": 46153857,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from an inode-allocation btree",
    "pmid": 46153858,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.increment",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved forward one inode-allocation\nbtree record",
    "pmid": 46153859,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.decrement",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved backward one inode-allocation\nbtree record",
    "pmid": 46153860,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new inode-allocation\nbtree record",
    "pmid": 46153861,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new inode-allocation\nbtree record",
    "pmid": 46153862,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new inode-allocation btree record",
    "pmid": 46153863,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting inode-allocation btree records",
    "pmid": 46153864,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during inode-allocation btree operations",
    "pmid": 46153865,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during inode-allocation btree operations",
    "pmid": 46153866,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.btree.inode.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during inode-allocation btree operations",
    "pmid": 46153867,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.write",
    "text-oneline": "number of XFS file system write operations",
    "text-help": "This is the number of write(2) system calls made to files in\nXFS file systems.",
    "pmid": 46155827,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.write_bytes",
    "text-oneline": "number of bytes written in XFS file system write operations",
    "text-help": "This is the number of bytes written via write(2) system calls to files\nin XFS file systems. It can be used in conjunction with the write_calls\ncount to calculate the average size of the write operations to files in\nXFS file systems.",
    "pmid": 46155828,
    "indom": 46137350,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.perdev.read",
    "text-oneline": "number of XFS file system read operations",
    "text-help": "This is the number of read(2) system calls made to files in XFS file\nsystems.",
    "pmid": 46155829,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.read_bytes",
    "text-oneline": "number of bytes read in XFS file system read operations",
    "text-help": "This is the number of bytes read via read(2) system calls to files in\nXFS file systems. It can be used in conjunction with the read_calls\ncount to calculate the average size of the read operations to files in\nXFS file systems.",
    "pmid": 46155830,
    "indom": 46137350,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.perdev.iflush_count",
    "text-oneline": "the number of calls to xfs_iflush",
    "text-help": "This is the number of calls to xfs_iflush which gets called when an\ninode is being flushed (such as by bdflush or tail pushing).\nxfs_iflush searches for other inodes in the same cluster which are\ndirty and flushable.",
    "pmid": 46155843,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.icluster_flushcnt",
    "text-oneline": "value from xs_icluster_flushcnt field of struct xfsstats",
    "text-help": "value from xs_icluster_flushcnt field of struct xfsstats",
    "pmid": 46155844,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.icluster_flushinode",
    "text-oneline": "number of flushes of only one inode in cluster",
    "text-help": "This is the number of times that the inode clustering was not able to\nflush anything but the one inode it was called with.",
    "pmid": 46155845,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.allocs.alloc_extent",
    "text-oneline": "XFS extents allocated",
    "text-help": "Number of file system extents allocated over XFS filesystems",
    "pmid": 46155776,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.allocs.alloc_block",
    "text-oneline": "XFS blocks allocated",
    "text-help": "Number of file system blocks allocated over XFS filesystems",
    "pmid": 46155777,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.allocs.free_extent",
    "text-oneline": "XFS extents freed",
    "text-help": "Number of file system extents freed over XFS filesystems",
    "pmid": 46155778,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.allocs.free_block",
    "text-oneline": "XFS blocks freed",
    "text-help": "Number of file system blocks freed over XFS filesystems",
    "pmid": 46155779,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.alloc_btree.lookup",
    "text-oneline": "lookups in XFS alloc btrees",
    "text-help": "Number of lookup operations in XFS filesystem allocation btrees",
    "pmid": 46155780,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.alloc_btree.compare",
    "text-oneline": "compares in XFS alloc btrees",
    "text-help": "Number of compares in XFS filesystem allocation btree lookups",
    "pmid": 46155781,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.alloc_btree.insrec",
    "text-oneline": "insertions in XFS alloc btrees",
    "text-help": "Number of extent records inserted into XFS filesystem allocation btrees",
    "pmid": 46155782,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.alloc_btree.delrec",
    "text-oneline": "deletions in XFS alloc btrees",
    "text-help": "Number of extent records deleted from XFS filesystem allocation btrees",
    "pmid": 46155783,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.read_ops",
    "text-oneline": "block map read ops in XFS",
    "text-help": "Number of block map for read operations performed on XFS files",
    "pmid": 46155784,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.write_ops",
    "text-oneline": "block map write ops in XFS",
    "text-help": "Number of block map for write operations performed on XFS files",
    "pmid": 46155785,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.unmap",
    "text-oneline": "block unmap ops in XFS",
    "text-help": "Number of block unmap (delete) operations performed on XFS files",
    "pmid": 46155786,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.add_exlist",
    "text-oneline": "extent list add ops in XFS",
    "text-help": "Number of extent list insertion operations for XFS files",
    "pmid": 46155787,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.del_exlist",
    "text-oneline": "extent list delete ops in XFS",
    "text-help": "Number of extent list deletion operations for XFS files",
    "pmid": 46155788,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.look_exlist",
    "text-oneline": "extent list lookup ops in XFS",
    "text-help": "Number of extent list lookup operations for XFS files",
    "pmid": 46155789,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.block_map.cmp_exlist",
    "text-oneline": "extent list compare ops in XFS",
    "text-help": "Number of extent list comparisons in XFS extent list lookups",
    "pmid": 46155790,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.bmap_btree.lookup",
    "text-oneline": "block map btree lookup ops in XFS",
    "text-help": "Number of block map btree lookup operations on XFS files",
    "pmid": 46155791,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.bmap_btree.compare",
    "text-oneline": "block map btree compare ops in XFS",
    "text-help": "Number of block map btree compare operations in XFS block map lookups",
    "pmid": 46155792,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.bmap_btree.insrec",
    "text-oneline": "block map btree insert ops in XFS",
    "text-help": "Number of block map btree records inserted for XFS files",
    "pmid": 46155793,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.bmap_btree.delrec",
    "text-oneline": "block map btree delete ops in XFS",
    "text-help": "Number of block map btree records deleted for XFS files",
    "pmid": 46155794,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.dir_ops.lookup",
    "text-oneline": "number of file name directory lookups",
    "text-help": "This is a count of the number of file name directory lookups in XFS\nfilesystems. It counts only those lookups which miss in the operating\nsystem's directory name lookup cache and must search the real directory\nstructure for the name in question.  The count is incremented once for\neach level of a pathname search that results in a directory lookup.",
    "pmid": 46155795,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.dir_ops.create",
    "text-oneline": "number of directory entry creation operations",
    "text-help": "This is the number of times a new directory entry was created in XFS\nfilesystems. Each time that a new file, directory, link, symbolic link,\nor special file is created in the directory hierarchy the count is\nincremented.",
    "pmid": 46155796,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.dir_ops.remove",
    "text-oneline": "number of directory entry remove operations",
    "text-help": "This is the number of times an existing directory entry was removed in\nXFS filesystems. Each time that a file, directory, link, symbolic link,\nor special file is removed from the directory hierarchy the count is\nincremented.",
    "pmid": 46155797,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.dir_ops.getdents",
    "text-oneline": "number of times the getdents operation is performed",
    "text-help": "This is the number of times the XFS directory getdents operation was\nperformed. The getdents operation is used by programs to read the\ncontents of directories in a file system independent fashion.  This\ncount corresponds exactly to the number of times the getdents(2) system\ncall was successfully used on an XFS directory.",
    "pmid": 46155798,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.transactions.sync",
    "text-oneline": "number of synchronous meta-data transactions performed",
    "text-help": "This is the number of meta-data transactions which waited to be\ncommitted to the on-disk log before allowing the process performing the\ntransaction to continue. These transactions are slower and more\nexpensive than asynchronous transactions, because they force the in\nmemory log buffers to be forced to disk more often and they wait for\nthe completion of the log buffer writes.",
    "pmid": 46155799,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.transactions.async",
    "text-oneline": "number of asynchronous meta-data transactions performed",
    "text-help": "This is the number of meta-data transactions which did not wait to be\ncommitted to the on-disk log before allowing the process performing the\ntransaction to continue. These transactions are faster and more\nefficient than synchronous transactions, because they commit their data\nto the in memory log buffers without forcing those buffers to be\nwritten to disk. This allows multiple asynchronous transactions to be\ncommitted to disk in a single log buffer write. Most transactions used\nin XFS file systems are asynchronous.",
    "pmid": 46155800,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.transactions.empty",
    "text-oneline": "number of meta-data transactions which committed without changing anything",
    "text-help": "This is the number of meta-data transactions which did not actually\nchange anything. These are transactions which were started for some\npurpose, but in the end it turned out that no change was necessary.",
    "pmid": 46155801,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_attempts",
    "text-oneline": "number of in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache. Whether the inode was found in the cache or\nneeded to be read in from the disk is not indicated here, but this can\nbe computed from the ig_found and ig_missed counts.",
    "pmid": 46155802,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_found",
    "text-oneline": "number of successful in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and found it. The closer this count is to the\nig_attempts count the better the inode cache is performing.",
    "pmid": 46155803,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_frecycle",
    "text-oneline": "number of just missed in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and saw that it was there but was unable to\nuse the in memory inode because it was being recycled by another\nprocess.",
    "pmid": 46155804,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_missed",
    "text-oneline": "number of failed in memory inode lookup operations",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and the inode was not there. The further this\ncount is from the ig_attempts count the better.",
    "pmid": 46155805,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_dup",
    "text-oneline": "number of inode cache insertions that fail because the inode is there",
    "text-help": "This is the number of times the operating system looked for an XFS\ninode in the inode cache and found that it was not there but upon\nattempting to add the inode to the cache found that another process had\nalready inserted it.",
    "pmid": 46155806,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_reclaims",
    "text-oneline": "number of in memory inode recycle operations",
    "text-help": "This is the number of times the operating system recycled an XFS inode\nfrom the inode cache in order to use the memory for that inode for\nanother purpose. Inodes are recycled in order to keep the inode cache\nfrom growing without bound. If the reclaim rate is high it may be\nbeneficial to raise the vnode_free_ratio kernel tunable variable to\nincrease the size of inode cache.",
    "pmid": 46155807,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.inode_ops.ig_attrchg",
    "text-oneline": "number of inode attribute change operations",
    "text-help": "This is the number of times the operating system explicitly changed the\nattributes of an XFS inode. For example, this could be to change the\ninode's owner, the inode's size, or the inode's timestamps.",
    "pmid": 46155808,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log.writes",
    "text-oneline": "number of buffer writes going to the disk from the log",
    "text-help": "This variable counts the number of log buffer writes going to the\nphysical log partitions of XFS filesystems. Log data traffic is\nproportional to the level of meta-data updating. Log buffer writes get\ngenerated when they fill up or external syncs occur.",
    "pmid": 46155809,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log.blocks",
    "text-oneline": "write throughput to the physical XFS log",
    "text-help": "This variable counts the number of Kbytes of information being written\nto the physical log partitions of XFS filesystems. Log data traffic\nis proportional to the level of meta-data updating. The rate with which\nlog data gets written depends on the size of internal log buffers and\ndisk write speed. Therefore, filesystems with very high meta-data\nupdating may need to stripe the log partition or put the log partition\non a separate drive.",
    "pmid": 46155810,
    "indom": 46137350,
    "sem": "counter",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log.write_ratio",
    "text-oneline": "ratio of count of XFS log blocks written to log writes",
    "text-help": "The ratio of log blocks written to log writes.  If block count isn't a\n\"reasonable\" multiple of writes, then many small log writes are being\nperformed - this is suboptimal.  Perfection is 64.  Fine-grain control\ncan be obtained when this metric is used in conjuntion with pmstore(1)\nand the xfs.control.reset metric.",
    "pmid": 46155854,
    "indom": 46137350,
    "sem": "instant",
    "units": "",
    "type": "FLOAT"
  },
  {
    "name": "xfs.perdev.log.noiclogs",
    "text-oneline": "count of failures for immediate get of buffered/internal",
    "text-help": "This variable keeps track of times when a logged transaction can not\nget any log buffer space. When this occurs, all of the internal log\nbuffers are busy flushing their data to the physical on-disk log.",
    "pmid": 46155811,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log.force",
    "text-oneline": "value from xs_log_force field of struct xfsstats",
    "text-help": "The number of times the in-core log is forced to disk.  It is\nequivalent to the number of successful calls to the function\nxfs_log_force().",
    "pmid": 46155812,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log.force_sleep",
    "text-oneline": "value from xs_log_force_sleep field of struct xfsstats",
    "text-help": "This metric is exported from the xs_log_force_sleep field of struct xfsstats",
    "pmid": 46155813,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.try_logspace",
    "text-oneline": "value from xs_try_logspace field of struct xfsstats",
    "text-help": "This metric is exported from the xs_try_logspace field of struct xfsstats",
    "pmid": 46155814,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.sleep_logspace",
    "text-oneline": "value from xs_sleep_logspace field of struct xfsstats",
    "text-help": "This metric is exported from the xs_sleep_logspace field of struct xfsstats",
    "pmid": 46155815,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.pushes",
    "text-oneline": "number of times the AIL tail is moved forward",
    "text-help": "The number of times the tail of the AIL is moved forward.  It is\nequivalent to the number of successful calls to the function\nxfs_trans_push_ail().",
    "pmid": 46155816,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.success",
    "text-oneline": "value from xs_push_ail_success field of struct xfsstats",
    "text-help": "value from xs_push_ail_success field of struct xfsstats",
    "pmid": 46155817,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.pushbuf",
    "text-oneline": "value from xs_push_ail_pushbuf field of struct xfsstats",
    "text-help": "value from xs_push_ail_pushbuf field of struct xfsstats",
    "pmid": 46155818,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.pinned",
    "text-oneline": "value from xs_push_ail_pinned field of struct xfsstats",
    "text-help": "value from xs_push_ail_pinned field of struct xfsstats",
    "pmid": 46155819,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.locked",
    "text-oneline": "value from xs_push_ail_locked field of struct xfsstats",
    "text-help": "value from xs_push_ail_locked field of struct xfsstats",
    "pmid": 46155820,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.flushing",
    "text-oneline": "value from xs_push_ail_flushing field of struct xfsstats",
    "text-help": "value from xs_push_ail_flushing field of struct xfsstats",
    "pmid": 46155821,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.restarts",
    "text-oneline": "value from xs_push_ail_restarts field of struct xfsstats",
    "text-help": "value from xs_push_ail_restarts field of struct xfsstats",
    "pmid": 46155822,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.log_tail.push_ail.flush",
    "text-oneline": "value from xs_push_ail_flush field of struct xfsstats",
    "text-help": "value from xs_push_ail_flush field of struct xfsstats",
    "pmid": 46155823,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.xstrat.bytes",
    "text-oneline": "number of bytes of data processed by the XFS daemons",
    "text-help": "This is the number of bytes of file data flushed out by the XFS\nflushing daemons.",
    "pmid": 46155824,
    "indom": 46137350,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "xfs.perdev.xstrat.quick",
    "text-oneline": "number of buffers processed by the XFS daemons written to contiguous space on disk",
    "text-help": "This is the number of buffers flushed out by the XFS flushing daemons\nwhich are written to contiguous space on disk. The buffers handled by\nthe XFS daemons are delayed allocation buffers, so this count gives an\nindication of the success of the XFS daemons in allocating contiguous\ndisk space for the data being flushed to disk.",
    "pmid": 46155825,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.xstrat.split",
    "text-oneline": "number of buffers processed by the XFS daemons written to non-contiguous space on disk",
    "text-help": "This is the number of buffers flushed out by the XFS flushing daemons\nwhich are written to non-contiguous space on disk. The buffers handled\nby the XFS daemons are delayed allocation buffers, so this count gives\nan indication of the failure of the XFS daemons in allocating\ncontiguous disk space for the data being flushed to disk. Large values\nin this counter indicate that the file system has become fragmented.",
    "pmid": 46155826,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.attr.get",
    "text-oneline": "number of \"get\" operations on XFS extended file attributes",
    "text-help": "The number of \"get\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"get\" operation retrieves the value of an\nextended attribute.",
    "pmid": 46155831,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.attr.set",
    "text-oneline": "number of \"set\" operations on XFS extended file attributes",
    "text-help": "The number of \"set\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"set\" operation creates and sets the value\nof an extended attribute.",
    "pmid": 46155832,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.attr.remove",
    "text-oneline": "number of \"remove\" operations on XFS extended file attributes",
    "text-help": "The number of \"remove\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"remove\" operation deletes an extended\nattribute.",
    "pmid": 46155833,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.attr.list",
    "text-oneline": "number of \"list\" operations on XFS extended file attributes",
    "text-help": "The number of \"list\" operations performed on extended file attributes\nwithin XFS filesystems.  The \"list\" operation retrieves the set of\nextended attributes associated with a file.",
    "pmid": 46155834,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.reclaims",
    "text-oneline": "value from xs_qm_dqreclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqreclaims field of struct xfsstats",
    "pmid": 46155835,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.reclaim_misses",
    "text-oneline": "value from xs_qm_dqreclaim_misses field of struct xfsstats",
    "text-help": "value from xs_qm_dqreclaim_misses field of struct xfsstats",
    "pmid": 46155836,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.dquot_dups",
    "text-oneline": "value from xs_qm_dquot_dups field of struct xfsstats",
    "text-help": "value from xs_qm_dquot_dups field of struct xfsstats",
    "pmid": 46155837,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.cachemisses",
    "text-oneline": "value from xs_qm_dqcachemisses field of struct xfsstats",
    "text-help": "value from xs_qm_dqcachemisses field of struct xfsstats",
    "pmid": 46155838,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.cachehits",
    "text-oneline": "value from xs_qm_dqcachehits field of struct xfsstats",
    "text-help": "value from xs_qm_dqcachehits field of struct xfsstats",
    "pmid": 46155839,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.wants",
    "text-oneline": "value from xs_qm_dqwants field of struct xfsstats",
    "text-help": "value from xs_qm_dqwants field of struct xfsstats",
    "pmid": 46155840,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.shake_reclaims",
    "text-oneline": "value from xs_qm_dqshake_reclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqshake_reclaims field of struct xfsstats",
    "pmid": 46155841,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.quota.inact_reclaims",
    "text-oneline": "value from xs_qm_dqinact_reclaims field of struct xfsstats",
    "text-help": "value from xs_qm_dqinact_reclaims field of struct xfsstats",
    "pmid": 46155842,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.get",
    "pmid": 46155916,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.create",
    "pmid": 46155917,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.get_locked",
    "pmid": 46155918,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.get_locked_waited",
    "pmid": 46155919,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.busy_locked",
    "pmid": 46155920,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.miss_locked",
    "pmid": 46155921,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.page_retries",
    "pmid": 46155922,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.page_found",
    "pmid": 46155923,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.buffer.get_read",
    "pmid": 46155924,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.active",
    "text-oneline": "number of vnodes not on free lists",
    "text-help": "number of vnodes not on free lists",
    "pmid": 46155846,
    "indom": 46137350,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.alloc",
    "text-oneline": "number of times vn_alloc called",
    "text-help": "number of times vn_alloc called",
    "pmid": 46155847,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.get",
    "text-oneline": "number of times vn_get called",
    "text-help": "number of times vn_get called",
    "pmid": 46155848,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.hold",
    "text-oneline": "number of times vn_hold called",
    "text-help": "number of times vn_hold called",
    "pmid": 46155849,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.rele",
    "text-oneline": "number of times vn_rele called",
    "text-help": "number of times vn_rele called",
    "pmid": 46155850,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.reclaim",
    "text-oneline": "number of times vn_reclaim called",
    "text-help": "number of times vn_reclaim called",
    "pmid": 46155851,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.remove",
    "text-oneline": "number of times vn_remove called",
    "text-help": "number of times vn_remove called",
    "pmid": 46155852,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.vnodes.free",
    "text-oneline": "number of times vn_free called",
    "text-help": "number of times vn_free called",
    "pmid": 46155853,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.lookup",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree record lookups",
    "pmid": 46155856,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.compare",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree record compares",
    "pmid": 46155857,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.insrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree insert record operations executed",
    "pmid": 46155858,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.delrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-block-number btree delete record operations executed",
    "pmid": 46155859,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to a free-space-by-block-number btree",
    "pmid": 46155860,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from a free-space-by-block-number btree",
    "pmid": 46155861,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.increment",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved forward one free-space-by-block-number\nbtree record",
    "pmid": 46155862,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.decrement",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved backward one free-space-by-block-number\nbtree record",
    "pmid": 46155863,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46155864,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46155865,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new free-space-by-block-number\nbtree record",
    "pmid": 46155866,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting free-space-by-block-number btree records",
    "pmid": 46155867,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during free-space-by-block-number btree operations",
    "pmid": 46155868,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during free-space-by-block-number btree operations",
    "pmid": 46155869,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_blocks.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during free-space-by-block-number btree operations",
    "pmid": 46155870,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.lookup",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree record lookups",
    "pmid": 46155871,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.compare",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree btree record compares",
    "pmid": 46155872,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.insrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree insert record operations executed",
    "pmid": 46155873,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.delrec",
    "text-oneline": "",
    "text-help": "Number of free-space-by-size btree delete record operations executed",
    "pmid": 46155874,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to a free-space-by-size btree tree",
    "pmid": 46155875,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from a free-space-by-size btree tree",
    "pmid": 46155876,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.increment",
    "text-oneline": "",
    "text-help": "Number of times a free-space-by-size btree cursor has been moved forward\none record",
    "pmid": 46155877,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.decrement",
    "text-oneline": "",
    "text-help": "Number of times a free-space-by-size btree cursor has been moved backward\none record",
    "pmid": 46155878,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new free-space-by-size\nbtree record",
    "pmid": 46155879,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new free-space-by-size\nbtree record",
    "pmid": 46155880,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new free-space-by-size btree\nrecord",
    "pmid": 46155881,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting free-space-by-size btree records",
    "pmid": 46155882,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during free-space-by-size btree operations",
    "pmid": 46155883,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during free-space-by-size btree operations",
    "pmid": 46155884,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.alloc_contig.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during free-space-by-size btree operations",
    "pmid": 46155885,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.lookup",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree record lookups",
    "pmid": 46155886,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.compare",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree record compares",
    "pmid": 46155887,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.insrec",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree insert record operations executed",
    "pmid": 46155888,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.delrec",
    "text-oneline": "",
    "text-help": "Number of inode-block-map/extent btree delete record operations executed",
    "pmid": 46155889,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to an inode-block-map/extent btree",
    "pmid": 46155890,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from an inode-block-map/extent btree",
    "pmid": 46155891,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.increment",
    "text-oneline": "",
    "text-help": "Number of times an inode-block-map/extent btree cursor has been moved\nforward one record",
    "pmid": 46155892,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.decrement",
    "text-oneline": "",
    "text-help": "Number of times an inode-block-map/extent btree cursor has been moved\nbackward one record",
    "pmid": 46155893,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46155894,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46155895,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new inode-block-map/extent\nbtree record",
    "pmid": 46155896,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting inode-block-map/extent btree records",
    "pmid": 46155897,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during inode-block-map/extent btree operations",
    "pmid": 46155898,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during inode-block-map/extent btree operations",
    "pmid": 46155899,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.block_map.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during inode-block-map/extent btree operations",
    "pmid": 46155900,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.lookup",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree record lookups",
    "pmid": 46155901,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.compare",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree record compares",
    "pmid": 46155902,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.insrec",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree insert record operations executed",
    "pmid": 46155903,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.delrec",
    "text-oneline": "",
    "text-help": "Number of inode-allocation btree delete record operations executed",
    "pmid": 46155904,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.newroot",
    "text-oneline": "",
    "text-help": "Number of times a new level is added to an inode-allocation btree",
    "pmid": 46155905,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.killroot",
    "text-oneline": "",
    "text-help": "Number of times a level is removed from an inode-allocation btree",
    "pmid": 46155906,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.increment",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved forward one inode-allocation\nbtree record",
    "pmid": 46155907,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.decrement",
    "text-oneline": "",
    "text-help": "Number of times a cursor has been moved backward one inode-allocation\nbtree record",
    "pmid": 46155908,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.lshift",
    "text-oneline": "",
    "text-help": "Left shift block operations to make space for a new inode-allocation\nbtree record",
    "pmid": 46155909,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.rshift",
    "text-oneline": "",
    "text-help": "Right shift block operations to make space for a new inode-allocation\nbtree record",
    "pmid": 46155910,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.split",
    "text-oneline": "",
    "text-help": "Split block operations to make space for a new inode-allocation btree record",
    "pmid": 46155911,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.join",
    "text-oneline": "",
    "text-help": "Merge block operations when deleting inode-allocation btree records",
    "pmid": 46155912,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.alloc",
    "text-oneline": "",
    "text-help": "Btree block allocations during inode-allocation btree operations",
    "pmid": 46155913,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.free",
    "text-oneline": "",
    "text-help": "Btree blocks freed during inode-allocation btree operations",
    "pmid": 46155914,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "xfs.perdev.btree.inode.moves",
    "text-oneline": "",
    "text-help": "Records moved inside blocks during inode-allocation btree operations",
    "pmid": 46155915,
    "indom": 46137350,
    "sem": "counter",
    "units": "count",
    "type": "U32"
  },
  {
    "name": "quota.state.project.accounting",
    "text-oneline": "1 indicates quota accounting enabled, else 0",
    "text-help": "1 indicates quota accounting enabled, else 0",
    "pmid": 46168064,
    "indom": 46137349,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "quota.state.project.enforcement",
    "text-oneline": "1 indicates quotas enforced, else 0",
    "text-help": "1 indicates quotas enforced, else 0",
    "pmid": 46168065,
    "indom": 46137349,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "quota.project.space.hard",
    "text-oneline": "hard limit for this project and filesys in Kbytes",
    "text-help": "hard limit for this project and filesys in Kbytes",
    "pmid": 46168070,
    "indom": 46137360,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "quota.project.space.soft",
    "text-oneline": "soft limit for this project and filesys in Kbytes",
    "text-help": "soft limit for this project and filesys in Kbytes",
    "pmid": 46168071,
    "indom": 46137360,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "quota.project.space.used",
    "text-oneline": "space used for this project and filesys in Kbytes",
    "text-help": "space used for this project and filesys in Kbytes",
    "pmid": 46168072,
    "indom": 46137360,
    "sem": "discrete",
    "units": "Kbyte",
    "type": "U64"
  },
  {
    "name": "quota.project.space.time_left",
    "text-oneline": "when soft limit is exceeded, seconds until it is enacted",
    "text-help": "when soft limit is exceeded, seconds until it is enacted",
    "pmid": 46168073,
    "indom": 46137360,
    "sem": "discrete",
    "units": "sec",
    "type": "32"
  },
  {
    "name": "quota.project.files.hard",
    "text-oneline": "file count hard limit for this project and filesys",
    "text-help": "file count hard limit for this project and filesys",
    "pmid": 46168074,
    "indom": 46137360,
    "sem": "discrete",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "quota.project.files.soft",
    "text-oneline": "file count soft limit for this project and filesys",
    "text-help": "file count soft limit for this project and filesys",
    "pmid": 46168075,
    "indom": 46137360,
    "sem": "discrete",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "quota.project.files.used",
    "text-oneline": "file count for this project and filesys",
    "text-help": "file count for this project and filesys",
    "pmid": 46168076,
    "indom": 46137360,
    "sem": "discrete",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "quota.project.files.time_left",
    "text-oneline": "when soft limit is exceeded, seconds until it is enacted",
    "text-help": "when soft limit is exceeded, seconds until it is enacted",
    "pmid": 46168077,
    "indom": 46137360,
    "sem": "discrete",
    "units": "sec",
    "type": "32"
  },
  {
    "name": "bcc.runq.latency",
    "text-oneline": "run queue (scheduler)latency distribution",
    "text-help": "run queue (scheduler)latency distribution",
    "pmid": 624955392,
    "indom": 624951300,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "bcc.proc.io.net.tcp.duration",
    "text-oneline": "duration of the TCP session (from TCP_ESTABLISHED/TCP_SYN_* until TCP_CLOSE)",
    "text-help": "duration of the TCP session (from TCP_ESTABLISHED/TCP_SYN_* until TCP_CLOSE)",
    "pmid": 624954376,
    "indom": 624951299,
    "sem": "instant",
    "units": "microsec",
    "type": "U32"
  },
  {
    "name": "bcc.proc.io.net.tcp.rx",
    "text-oneline": "received data",
    "text-help": "received data",
    "pmid": 624954375,
    "indom": 624951299,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "bcc.proc.io.net.tcp.tx",
    "text-oneline": "transmitted data",
    "text-help": "transmitted data",
    "pmid": 624954374,
    "indom": 624951299,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "bcc.proc.io.net.tcp.dport",
    "text-oneline": "destination port",
    "text-help": "destination port",
    "pmid": 624954373,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "bcc.proc.io.net.tcp.daddr",
    "text-oneline": "destination address",
    "text-help": "destination address",
    "pmid": 624954372,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "bcc.proc.io.net.tcp.lport",
    "text-oneline": "local port",
    "text-help": "local port",
    "pmid": 624954371,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "bcc.proc.io.net.tcp.laddr",
    "text-oneline": "local address",
    "text-help": "local address",
    "pmid": 624954370,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "bcc.proc.io.net.tcp.comm",
    "text-oneline": "command",
    "text-help": "command",
    "pmid": 624954369,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "bcc.proc.io.net.tcp.pid",
    "text-oneline": "PID",
    "text-help": "PID",
    "pmid": 624954368,
    "indom": 624951299,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "bcc.proc.sysfork",
    "text-oneline": "fork rate",
    "text-help": "fork rate",
    "pmid": 624953344,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "bcc.disk.all.latency",
    "text-oneline": "block io latency distribution",
    "text-help": "block io latency distribution",
    "pmid": 624951296,
    "indom": 624951296,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nvidia.numcards",
    "text-oneline": "Number of Graphics Cards",
    "text-help": "The number of NVIDIA Graphics cards installed in this system",
    "pmid": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.gpuid",
    "text-oneline": "GPU ID",
    "text-help": "Zero indexed id of this NVIDIA card",
    "pmid": 503316481,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.cardname",
    "text-oneline": "GPU Name",
    "text-help": "The name of the graphics card",
    "pmid": 503316482,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "nvidia.busid",
    "text-oneline": "Card Bus ID",
    "text-help": "The Bus ID as reported by the NVIDIA tools, not lspci",
    "pmid": 503316483,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "nvidia.temp",
    "text-oneline": "The temperature of the card",
    "text-help": "The Temperature of the GPU on the NVIDIA card in degrees celcius.",
    "pmid": 503316484,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.fanspeed",
    "text-oneline": "Fanspeed",
    "text-help": "Speed of the GPU fan as a percentage of the maximum",
    "pmid": 503316485,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.perfstate",
    "text-oneline": "NVIDIA performance state",
    "text-help": "The PX performance state as reported from NVML.  Value is an integer\nwhich should range from 0 (maximum performance) to 15 (minimum).  If\nthe state is unknown the reported value will be 32, however.",
    "pmid": 503316486,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.gpuactive",
    "text-oneline": "Percentage of GPU utilization",
    "text-help": "Percentage of time over the past sample period during which one or more\nkernels was executing on the GPU.",
    "pmid": 503316487,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.memactive",
    "text-oneline": "Percentage of time spent accessing memory",
    "text-help": "Percent of time over the past sample period during which global (device)\nmemory was being read or written.  This metric shows if the memory is\nactively being accesed, and is not correlated to storage amount used.",
    "pmid": 503316488,
    "indom": 503316480,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.memused",
    "text-oneline": "Allocated FB memory",
    "text-help": "Amount of GPU FB memory that has currently been allocated, in bytes.\nNote that the driver/GPU always sets aside a small amount of memory\nfor bookkeeping. ",
    "pmid": 503316489,
    "indom": 503316480,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "nvidia.memtotal",
    "text-oneline": "Total FB memory available",
    "text-help": "The total amount of GPU FB memory available on the card, in bytes.",
    "pmid": 503316490,
    "indom": 503316480,
    "sem": "discrete",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "nvidia.memfree",
    "text-oneline": "Unallocated FB memory",
    "text-help": "Amount of GPU FB memory that is not currently allocated, in bytes.",
    "pmid": 503316491,
    "indom": 503316480,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "nvidia.proc.samples",
    "text-oneline": "Number of times process stats have been sampled",
    "text-help": "Number of times process stats have been sampled",
    "pmid": 503317516,
    "indom": 503316481,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "nvidia.proc.memused",
    "text-oneline": "Memory in use by each process accessing each card",
    "text-help": "Memory in use by each process accessing each card",
    "pmid": 503317517,
    "indom": 503316481,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "nvidia.proc.memaccum",
    "text-oneline": "Accumulated memory used by processes accessing each card",
    "text-help": "Accumulated memory used by processes accessing each card",
    "pmid": 503317518,
    "indom": 503316481,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "nvidia.proc.gpuactive",
    "text-oneline": "Graphics card utilization by processes accessing each card",
    "text-help": "Graphics card utilization by processes accessing each card",
    "pmid": 503317519,
    "indom": 503316481,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.proc.memactive",
    "text-oneline": "Memory access utilization by processes accessing each card",
    "text-help": "Memory access utilization by processes accessing each card",
    "pmid": 503317520,
    "indom": 503316481,
    "sem": "instant",
    "units": "",
    "type": "U32"
  },
  {
    "name": "nvidia.proc.time",
    "text-oneline": "Milliseconds spent by processes accessing each graphics card",
    "text-help": "Milliseconds spent by processes accessing each graphics card",
    "pmid": 503317521,
    "indom": 503316481,
    "sem": "counter",
    "units": "millisec",
    "type": "U64"
  },
  {
    "name": "vector.task.cpuflamegraph",
    "text-oneline": "CPU flame graph.",
    "text-help": "CPU flame graph.",
    "pmid": 612368384,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.disklatencyheatmap",
    "text-oneline": "Status of a disk I/O latency heatmap request.",
    "text-help": "Status of a disk I/O latency heatmap request.",
    "pmid": 612368385,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.jstackflamegraph",
    "text-oneline": "Status of a jstack request.",
    "text-help": "Status of a jstack request.",
    "pmid": 612368386,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.pnamecpuflamegraph",
    "text-oneline": "Profile CPU instruction pointer and create a package name flame graph.",
    "text-help": "Profile CPU instruction pointer and create a package name flame graph.",
    "pmid": 612368387,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.uninlinedcpuflamegraph",
    "text-oneline": "Profile CPU stack traces with some uninlining for a flame graph.",
    "text-help": "Profile CPU stack traces with some uninlining for a flame graph.",
    "pmid": 612368388,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.pagefaultflamegraph",
    "text-oneline": "Trace page faults with stacks and create a flame graph.",
    "text-help": "Trace page faults with stacks and create a flame graph.",
    "pmid": 612368389,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.diskioflamegraph",
    "text-oneline": "Trace disk I/O issues with stacks and create a flame graph.",
    "text-help": "Trace disk I/O issues with stacks and create a flame graph.",
    "pmid": 612368390,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.ipcflamegraph",
    "text-oneline": "Instructions-per-cycle flame graph (requires PMC availability).",
    "text-help": "Instructions-per-cycle flame graph (requires PMC availability).",
    "pmid": 612368391,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.cswflamegraph",
    "text-oneline": "Context switch flame graph (requires BPF features).",
    "text-help": "Context switch flame graph (requires BPF features).",
    "pmid": 612368392,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.offcpuflamegraph",
    "text-oneline": "Off-CPU time flame graph (requires BPF features).",
    "text-help": "Off-CPU time flame graph (requires BPF features).",
    "pmid": 612368393,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "vector.task.offwakeflamegraph",
    "text-oneline": "Off-wake time flame graph (requires BPF features).",
    "text-help": "Off-wake time flame graph (requires BPF features).",
    "pmid": 612368394,
    "sem": "discrete",
    "units": "",
    "type": "STRING"
  },
  {
    "name": "titustc.network.out.requeues_packets",
    "text-oneline": "tc network requeues",
    "text-help": "Number of packets requeued by tc",
    "pmid": 633340934,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.overlimits_packets",
    "text-oneline": "tc network overflows",
    "text-help": "Number of packets marked with overlimits by tc",
    "pmid": 633340933,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.dropped_packets",
    "text-oneline": "tc dropped packets",
    "text-help": "Number of packets dropped at TC",
    "pmid": 633340932,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.packets",
    "text-oneline": "packets",
    "text-help": "Network packets",
    "pmid": 633340931,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.bytes",
    "text-oneline": "bytes",
    "text-help": "Network bytes",
    "pmid": 633340930,
    "indom": 633339904,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.ceiling",
    "text-oneline": "traffic ceiling",
    "text-help": "Network ceiling traffic rate",
    "pmid": 633340929,
    "indom": 633339904,
    "sem": "discrete",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "titustc.network.out.rate",
    "text-oneline": "traffic rate",
    "text-help": "Network allocated traffic rate",
    "pmid": 633340928,
    "indom": 633339904,
    "sem": "discrete",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.requeues_packets",
    "text-oneline": "tc network requeues",
    "text-help": "Number of packets requeued by tc",
    "pmid": 633339910,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.overlimits_packets",
    "text-oneline": "tc network overflows",
    "text-help": "Number of packets marked with overlimits by tc",
    "pmid": 633339909,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.dropped_packets",
    "text-oneline": "tc dropped packets",
    "text-help": "Number of packets dropped at TC",
    "pmid": 633339908,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.packets",
    "text-oneline": "packets",
    "text-help": "Network packets",
    "pmid": 633339907,
    "indom": 633339904,
    "sem": "counter",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.bytes",
    "text-oneline": "bytes",
    "text-help": "Network bytes",
    "pmid": 633339906,
    "indom": 633339904,
    "sem": "counter",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.ceiling",
    "text-oneline": "traffic ceiling",
    "text-help": "Network ceiling traffic rate",
    "pmid": 633339905,
    "indom": 633339904,
    "sem": "discrete",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "titustc.network.in.rate",
    "text-oneline": "traffic rate",
    "text-help": "Network allocated traffic rate",
    "pmid": 633339904,
    "indom": 633339904,
    "sem": "discrete",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "titusovfs.fsync.latency",
    "text-oneline": "fsync latency",
    "text-help": "ovfs fsync call latency",
    "pmid": 637537280,
    "indom": 637534213,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titusovfs.open.latency",
    "text-oneline": "open latency",
    "text-help": "ovfs open call latency",
    "pmid": 637536256,
    "indom": 637534212,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titusovfs.write.latency",
    "text-oneline": "write latency",
    "text-help": "ovfs write call latency histogram",
    "pmid": 637535233,
    "indom": 637534211,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titusovfs.write.bytes_per_sec",
    "text-oneline": "write bytes",
    "text-help": "ovfs write call bytes per second",
    "pmid": 637535232,
    "indom": 637534210,
    "sem": "instant",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "titusovfs.read.latency",
    "text-oneline": "read latency",
    "text-help": "ovfs read call latency histogram",
    "pmid": 637534209,
    "indom": 637534209,
    "sem": "instant",
    "units": "count",
    "type": "U64"
  },
  {
    "name": "titusovfs.read.bytes_per_sec",
    "text-oneline": "read bytes",
    "text-help": "ovfs read call bytes per second",
    "pmid": 637534208,
    "indom": 637534208,
    "sem": "instant",
    "units": "byte sec",
    "type": "U64"
  },
  {
    "name": "event.flags",
    "pmid": 2143289345,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "event.missed",
    "pmid": 2143289346,
    "sem": "discrete",
    "units": "",
    "type": "U32"
  },
  {
    "name": "disk.dev.await",
    "pmid": 2143289347,
    "indom": 251658241,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.r_await",
    "pmid": 2143289348,
    "indom": 251658241,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.w_await",
    "pmid": 2143289349,
    "indom": 251658241,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.avg_qlen",
    "pmid": 2143289350,
    "indom": 251658241,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.avg_rqsz",
    "pmid": 2143289351,
    "indom": 251658241,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.r_avg_rqsz",
    "pmid": 2143289352,
    "indom": 251658241,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.w_avg_rqsz",
    "pmid": 2143289353,
    "indom": 251658241,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dev.util",
    "pmid": 2143289354,
    "indom": 251658241,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.await",
    "pmid": 2143289355,
    "indom": 251658264,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.r_await",
    "pmid": 2143289356,
    "indom": 251658264,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.w_await",
    "pmid": 2143289357,
    "indom": 251658264,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.avg_qlen",
    "pmid": 2143289358,
    "indom": 251658264,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.avg_rqsz",
    "pmid": 2143289359,
    "indom": 251658264,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.r_avg_rqsz",
    "pmid": 2143289360,
    "indom": 251658264,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.w_avg_rqsz",
    "pmid": 2143289361,
    "indom": 251658264,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.dm.util",
    "pmid": 2143289362,
    "indom": 251658264,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.await",
    "pmid": 2143289363,
    "indom": 251658265,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.r_await",
    "pmid": 2143289364,
    "indom": 251658265,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.w_await",
    "pmid": 2143289365,
    "indom": 251658265,
    "sem": "instant",
    "units": "millisec / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.avg_qlen",
    "pmid": 2143289366,
    "indom": 251658265,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.avg_rqsz",
    "pmid": 2143289367,
    "indom": 251658265,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.r_avg_rqsz",
    "pmid": 2143289368,
    "indom": 251658265,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.w_avg_rqsz",
    "pmid": 2143289369,
    "indom": 251658265,
    "sem": "instant",
    "units": "Kbyte / count",
    "type": "DOUBLE"
  },
  {
    "name": "disk.md.util",
    "pmid": 2143289370,
    "indom": 251658265,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "proc.psinfo.age",
    "pmid": 2143289371,
    "indom": 12582921,
    "sem": "instant",
    "units": "sec",
    "type": "DOUBLE"
  },
  {
    "name": "proc.io.total_bytes",
    "pmid": 2143289372,
    "indom": 12582921,
    "sem": "instant",
    "units": "byte",
    "type": "U64"
  },
  {
    "name": "proc.hog.cpu",
    "pmid": 2143289373,
    "indom": 12582921,
    "sem": "instant",
    "units": "/ sec",
    "type": "DOUBLE"
  },
  {
    "name": "proc.hog.mem",
    "pmid": 2143289374,
    "indom": 12582921,
    "sem": "instant",
    "units": "Kbyte",
    "type": "U32"
  },
  {
    "name": "proc.hog.disk",
    "pmid": 2143289375,
    "indom": 12582921,
    "sem": "instant",
    "units": "byte / sec^2",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.user",
    "pmid": 2143289376,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.nice",
    "pmid": 2143289377,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.sys",
    "pmid": 2143289378,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.idle",
    "pmid": 2143289379,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.intr",
    "pmid": 2143289380,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.wait",
    "pmid": 2143289381,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  },
  {
    "name": "kernel.cpu.util.steal",
    "pmid": 2143289382,
    "sem": "instant",
    "units": "",
    "type": "DOUBLE"
  }
]
