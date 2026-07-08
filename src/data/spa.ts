// EXPORTS: ISpaModule, MOCK_SPA_MODULES
export interface ISpaModule {
  id: string
  moduleNumber: number
  title: string
  subtitle: string
  anchor: string
  icon: string
  description: string
}

export const MOCK_SPA_MODULES: ISpaModule[] = [
  {
    id: '1',
    moduleNumber: 1,
    title: '开篇导学',
    subtitle: '温故知新',
    anchor: '#module1',
    icon: 'BookOpen',
    description: '回顾旧知+实景类比+课前检测'
  },
  {
    id: '2',
    moduleNumber: 2,
    title: '二面角概念',
    subtitle: '新知1',
    anchor: '#module2',
    icon: 'Triangle',
    description: '二面角定义、平面角作法、直二面角'
  },
  {
    id: '3',
    moduleNumber: 3,
    title: '面面垂直判定',
    subtitle: '新知2',
    anchor: '#module3',
    icon: 'Square',
    description: '判定定理、三语言、四面体例题'
  },
  {
    id: '4',
    moduleNumber: 4,
    title: '虚拟折纸',
    subtitle: '实操',
    anchor: '#module4',
    icon: 'Origami',
    description: '动手折纸，感受二面角变化'
  },
  {
    id: '5',
    moduleNumber: 5,
    title: '随堂练习',
    subtitle: '分层练习',
    anchor: '#module5',
    icon: 'PenTool',
    description: '基础/提升/拓展三层练习'
  },
  {
    id: '6',
    moduleNumber: 6,
    title: '课堂小结',
    subtitle: '课后任务',
    anchor: '#module6',
    icon: 'Award',
    description: '思维导图+闯关游戏+课后任务'
  }
]