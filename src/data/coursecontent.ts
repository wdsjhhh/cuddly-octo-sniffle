// EXPORTS: ICourseContent, MOCK_COURSE_CONTENT
export interface IQuizOption {
  key: string
  text: string
}

export interface IQuizQuestion {
  id: string
  question: string
  options: IQuizOption[]
  answer: string
  analysis: string
}

export interface IFillBlank {
  id: string
  question: string
  blanks: { key: string; answer: string }[]
  analysis: string
}

export interface IProofStep {
  id: string
  text: string
  blankKey?: string
  options?: string[]
  answer?: string
}

export interface IModule {
  id: string
  moduleIndex: number
  title: string
  subtitle: string
  anchor: string
  icon: string
}

export interface ICourseContent {
  id: string
  title: string
  subtitle: string
  modules: IModule[]
  module1: {
    cover: {
      title: string
      subtitle: string
      description: string
    }
    dragSort: {
      instruction: string
      items: string[]
      correctOrder: string[]
      errorTip: string
      successTip: string
    }
    realSceneAnalogies: {
      id: string
      name: string
      description: string
    }[]
    comparisonTable: {
      title: string
      rows: { concept: string; planeAngle: string; dihedralAngle: string }[]
    }
    preQuiz: IQuizQuestion[]
  }
  module2: {
    dihedralAngleDef: {
      description: string
      notations: { label: string; formula: string }[]
    }
    planeAngle: {
      description: string
      steps: string[]
      conclusion: string
      classifications: { range: string; name: string }[]
     易错点: string
    }
    classroomFillBlank: IFillBlank
    examples: {
      id: string
      title: string
      description: string
      subQuestions: { question: string; answer: string; steps: string[] }[]
    }[]
    mnemonicCards: { title: string; description: string }[]
  }
  module3: {
    cuboidModel: {
      description: string
      conclusion: string
    }
    threeLanguages: {
      text: string
      graphic: string
      symbol: string
      shorthand: string
    }
    theoremProof: string[]
    tetrahedronExample: {
      title: string
      problem: string
      auxiliaryLines: string[]
      proofSteps: IProofStep[]
    }
    proofFlowchart: { step: string; description: string }[]
  }
  module4: {
    origamiTask: {
      instruction: string
      tasks: { angle: number; tolerance: number; tip: string }[]
      badgeName: string
    }
    realSceneCarousel: { id: string; name: string; description: string }[]
  }
  module5: {
    basicLevel: {
      quizzes: IQuizQuestion[]
      fillBlanks: IFillBlank[]
    }
    advancedLevel: {
      handDraw: {
        instruction: string
        criteria: string[]
      }
      proofFillBlanks: {
        title: string
        problem: string
        steps: IProofStep[]
      }
    }
    extensionLevel: {
      title: string
      problem: string
      hints: string[]
    }
  }
  module6: {
    mindMap: {
      id: string
      label: string
      children?: { id: string; label: string; children?: { id: string; label: string }[] }[]
    }[]
    challengeGame: {
      questions: { id: string; statement: string; answer: boolean; analysis: string }[]
      badgeName: string
    }
    homework: {
      id: string
      level: 'basic' | 'practice1' | 'practice2'
      title: string
      description: string
    }[]
    ending: {
      summary: string
      congratulation: string
    }
  }
}

export const MOCK_COURSE_CONTENT: ICourseContent = {
  id: '1',
  title: '8.6.3 平面与平面垂直（第一课时）',
  subtitle: '高中数学必修第二册',
  modules: [
    { id: 'm1', moduleIndex: 1, title: '开篇导学', subtitle: '温故知新', anchor: '#module1', icon: 'BookOpen' },
    { id: 'm2', moduleIndex: 2, title: '二面角概念', subtitle: '新知1', anchor: '#module2', icon: 'Triangle' },
    { id: 'm3', moduleIndex: 3, title: '面面垂直判定', subtitle: '新知2', anchor: '#module3', icon: 'Square' },
    { id: 'm4', moduleIndex: 4, title: '虚拟折纸', subtitle: '实操', anchor: '#module4', icon: 'Origami' },
    { id: 'm5', moduleIndex: 5, title: '随堂练习', subtitle: '分层巩固', anchor: '#module5', icon: 'PenTool' },
    { id: 'm6', moduleIndex: 6, title: '课堂小结', subtitle: '课后任务', anchor: '#module6', icon: 'Award' },
  ],
  module1: {
    cover: {
      title: '8.6.3 平面与平面垂直',
      subtitle: '第一课时',
      description: '探究主线：线线垂直 → 线面垂直 → 面面垂直',
    },
    dragSort: {
      instruction: '请将下列垂直关系按研究顺序从左到右排列',
      items: ['线线垂直', '线面垂直', '面面垂直'],
      correctOrder: ['线线垂直', '线面垂直', '面面垂直'],
      errorTip: '先研究直线，再研究平面，请重新排序',
      successTip: '由线到面，定义→判定→性质，非常好！',
    },
    realSceneAnalogies: [
      { id: 's1', name: '水坝横截面', description: '水坝坡面与水平面形成二面角' },
      { id: 's2', name: '教室墙角', description: '两面墙面与地面形成三个直二面角' },
      { id: 's3', name: '打开的书本', description: '书页间形成的角就是二面角' },
      { id: 's4', name: '长方体', description: '相邻两个面形成直二面角' },
    ],
    comparisonTable: {
      title: '平面角 vs 二面角',
      rows: [
        { concept: '定义', planeAngle: '从一点出发的两条射线组成', dihedralAngle: '从一条直线出发的两个半平面组成' },
        { concept: '表示法', planeAngle: '∠AOB', dihedralAngle: 'α-l-β' },
        { concept: '大小范围', planeAngle: '0°~180°', dihedralAngle: '0°~180°' },
      ],
    },
    preQuiz: [
      {
        id: 'q1',
        question: '线面垂直的判定定理是？',
        options: [
          { key: 'A', text: '如果一条直线垂直于平面内一条直线，则垂直于平面' },
          { key: 'B', text: '如果一条直线垂直于平面内两条相交直线，则垂直于平面' },
          { key: 'C', text: '如果一条直线平行于平面内两条直线，则垂直于平面' },
          { key: 'D', text: '如果一条直线垂直于平面内无数条直线，则垂直于平面' },
        ],
        answer: 'B',
        analysis: '线面垂直判定定理：一条直线与一个平面内的两条相交直线都垂直，则该直线与此平面垂直。',
      },
      {
        id: 'q2',
        question: '两条异面直线所成角的范围是？',
        options: [
          { key: 'A', text: '(0°, 90°]' },
          { key: 'B', text: '[0°, 90°]' },
          { key: 'C', text: '(0°, 180°)' },
          { key: 'D', text: '[0°, 180°]' },
        ],
        answer: 'A',
        analysis: '异面直线所成角取锐角或直角，范围是 (0°, 90°]。',
      },
      {
        id: 'q3',
        question: '以下哪个不是空间中垂直关系的研究层次？',
        options: [
          { key: 'A', text: '线线垂直' },
          { key: 'B', text: '线面垂直' },
          { key: 'C', text: '面面垂直' },
          { key: 'D', text: '点点垂直' },
        ],
        answer: 'D',
        analysis: '空间垂直关系研究三个层次：线线垂直、线面垂直、面面垂直。',
      },
    ],
  },
  module2: {
    dihedralAngleDef: {
      description: '从一条直线出发的两个半平面所组成的图形叫做二面角。这条直线叫做二面角的棱，这两个半平面叫做二面角的面。',
      notations: [
        { label: '记法一', formula: 'α-l-β' },
        { label: '记法二', formula: 'α-AB-β' },
        { label: '记法三', formula: 'P-l-Q' },
      ],
    },
    planeAngle: {
      description: '以二面角的棱上任意一点为端点，在两个面内分别作垂直于棱的两条射线，这两条射线所成的角叫做二面角的平面角。',
      steps: ['棱上取点 O', '在 α 内作 OA ⊥ l', '在 β 内作 OB ⊥ l', '形成 ∠AOB（平面角）'],
      conclusion: '平面角的大小与棱上顶点的位置无关，只与二面角的张角大小有关。',
      classifications: [
        { range: '0° < θ < 90°', name: '锐二面角' },
        { range: 'θ = 90°', name: '直二面角' },
        { range: '90° < θ < 180°', name: '钝二面角' },
        { range: 'θ = 180°', name: '平二面角' },
      ],
      易错点: '平面角的两边必须都垂直于棱，且顶点在棱上。只有一边垂直或顶点不在棱上都不是平面角。',
    },
    classroomFillBlank: {
      id: 'fb1',
      question: '观察教室墙角（墙面与地面），填空：',
      blanks: [
        { key: 'edge', answer: '墙角线' },
        { key: 'degree', answer: '90°' },
      ],
      analysis: '教室墙面与地面的交线是棱，两墙面与地面都成直二面角（90°）。',
    },
    examples: [
      {
        id: 'ex1',
        title: '例1 正方体',
        description: '正方体 ABCD-A₁B₁C₁D₁，求二面角 A-BC-A₁ 的大小。',
        subQuestions: [
          {
            question: '求二面角 A-BC-A₁ 的大小',
            answer: '45°',
            steps: [
              'BC ⊥ AB，BC ⊥ A₁B（正方形性质）',
              '∠ABA₁ 是二面角 A-BC-A₁ 的平面角',
              '在 Rt△ABA₁ 中，AB = AA₁',
              '∠ABA₁ = 45°',
            ],
          },
        ],
      },
      {
        id: 'ex2',
        title: '例2 正方形+垂线',
        description: '正方形 ABCD，PA ⊥ 平面 ABCD，PA = AB，求下列二面角。',
        subQuestions: [
          {
            question: '平面 PAB 与平面 ABCD 的二面角',
            answer: '90°',
            steps: ['PA ⊥ 平面 ABCD，PA ⊂ 平面 PAB', '平面 PAB ⊥ 平面 ABCD', '二面角为直二面角 90°'],
          },
          {
            question: '平面 PBC 与平面 ABCD 的二面角',
            answer: '45°',
            steps: ['AB 是 PB 在底面的射影，BC ⊥ AB', 'BC ⊥ PB（三垂线定理）', '∠PBA 是平面角', 'PA = AB，∠PBA = 45°'],
          },
        ],
      },
    ],
    mnemonicCards: [
      { title: '一作', description: '作平面角：在棱上取点，两面作垂线' },
      { title: '二证', description: '证平面角：证明该角确实是二面角的平面角' },
      { title: '三求', description: '求角度：解三角形求平面角大小' },
    ],
  },
  module3: {
    cuboidModel: {
      description: '观察长方体，侧面 ABB₁A₁ 内的棱 AA₁ 垂直于底面 ABCD，那么侧面 ABB₁A₁ 与底面 ABCD 有什么关系？',
      conclusion: '一个平面过另一个平面的一条垂线，则这两个平面互相垂直。',
    },
    threeLanguages: {
      text: '如果一个平面过另一个平面的垂线，那么这两个平面垂直。',
      graphic: 'α、β 两个平面 + 垂线 a，a⊥α，a⊂β',
      symbol: 'a ⊥ α，a ⊂ β ⇒ α ⊥ β',
      shorthand: '线面垂直 ⇒ 面面垂直',
    },
    theoremProof: [
      '已知：a ⊥ α，a ⊂ β',
      '求证：α ⊥ β',
      '证明：设 a ∩ α = A，在 α 内过 A 作直线 b ⊥ l（l 为 α∩β）',
      '∵ a ⊥ α，∴ a ⊥ l',
      '又 b ⊥ l，且 a ∩ b = A',
      '∴ l ⊥ 平面由 a、b 确定的平面',
      '∴ 二面角的平面角为 90°',
      '∴ α ⊥ β',
    ],
    tetrahedronExample: {
      title: '例7 四面体',
      problem: '四面体 ABSC 中，AB = BC = CA = SB = SC = SA，求证：平面 ABC ⊥ 平面 SBC。',
      auxiliaryLines: ['取 BC 中点 D', '连接 SD、AD'],
      proofSteps: [
        { id: 's1', text: '∵ SB = SC，D 为 BC 中点', blankKey: 'k1', options: ['SD ⊥ BC', 'SD ∥ BC', 'SD = BC'], answer: 'SD ⊥ BC' },
        { id: 's2', text: '同理 AB = AC，D 为 BC 中点，∴ AD ⊥ BC', blankKey: 'k2', answer: '' },
        { id: 's3', text: '∴ ∠SDA 是二面角 S-BC-A 的______', blankKey: 'k3', options: ['平面角', '棱', '补角'], answer: '平面角' },
        { id: 's4', text: '设棱长为 a，SD = AD = √3/2 a，SA = a', blankKey: 'k4', answer: '' },
        { id: 's5', text: '由勾股定理逆定理，SD² + AD² = SA²，∴ SD ⊥ AD', blankKey: 'k5', answer: '' },
        { id: 's6', text: '∴ 二面角为直二面角，平面 ABC ⊥ 平面 SBC（______）', blankKey: 'k6', options: ['面面垂直定义', '线面垂直判定', 'SSS'], answer: '面面垂直定义' },
      ],
    },
    proofFlowchart: [
      { step: '分析垂直关系', description: '找出已知的线线、线面垂直条件' },
      { step: '找平面垂线', description: '在一个平面内寻找另一个平面的垂线' },
      { step: '证线面垂直', description: '证明这条直线垂直于另一个平面' },
      { step: '套用判定定理', description: '由线面垂直得出面面垂直' },
    ],
  },
  module4: {
    origamiTask: {
      instruction: '拖动滑块折叠纸张，完成以下任务解锁勋章！',
      tasks: [
        { angle: 45, tolerance: 2, tip: '折出 45° 锐二面角' },
        { angle: 90, tolerance: 2, tip: '折出 90° 直二面角（两平面垂直！）' },
      ],
      badgeName: '作图大师',
    },
    realSceneCarousel: [
      { id: 'r1', name: '屋顶坡面', description: '屋顶两个坡面形成二面角，影响排水' },
      { id: 'r2', name: '文件夹', description: '文件夹开合角度就是二面角' },
      { id: 'r3', name: '阶梯水坝', description: '阶梯式水坝坡面与水平面成固定二面角' },
    ],
  },
  module5: {
    basicLevel: {
      quizzes: [
        {
          id: 'b1',
          question: '二面角 α-l-β 的平面角 ∠AOB 中，O 点的位置？',
          options: [
            { key: 'A', text: '在平面 α 内任意位置' },
            { key: 'B', text: '在棱 l 上任意位置' },
            { key: 'C', text: '在平面 β 内任意位置' },
            { key: 'D', text: '在二面角内部任意位置' },
          ],
          answer: 'B',
          analysis: '平面角的顶点必须在棱上，且两边分别在两个半平面内且垂直于棱。',
        },
        {
          id: 'b2',
          question: '下列哪个是直二面角？',
          options: [
            { key: 'A', text: '二面角为 60°' },
            { key: 'B', text: '二面角为 90°' },
            { key: 'C', text: '二面角为 120°' },
            { key: 'D', text: '二面角为 180°' },
          ],
          answer: 'B',
          analysis: '平面角是直角的二面角叫做直二面角，此时两平面互相垂直。',
        },
      ],
      fillBlanks: [
        {
          id: 'bf1',
          question: '正方体 ABCD-A₁B₁C₁D₁ 中，二面角 B-CC₁-D 的大小是______°',
          blanks: [{ key: 'ans', answer: '90' }],
          analysis: 'BC ⊥ CC₁，CD ⊥ CC₁，∠BCD 是平面角，正方形中 ∠BCD = 90°。',
        },
      ],
    },
    advancedLevel: {
      handDraw: {
        instruction: '请在图中手绘出二面角 α-l-β 的平面角',
        criteria: ['顶点在棱 l 上', '一边在 α 内且垂直于棱', '另一边在 β 内且垂直于棱'],
      },
      proofFillBlanks: {
        title: '证明题',
        problem: '已知 PA ⊥ 平面 ABC，AB ⊥ BC，求证：平面 PAB ⊥ 平面 PBC。',
        steps: [
          { id: 'p1', text: '∵ PA ⊥ 平面 ABC，BC ⊂ 平面 ABC', blankKey: 'k1', answer: '' },
          { id: 'p2', text: '∴ PA ______ BC', blankKey: 'k2', options: ['⊥', '∥', '='], answer: '⊥' },
          { id: 'p3', text: '又 AB ⊥ BC，PA ∩ AB = A', blankKey: 'k3', answer: '' },
          { id: 'p4', text: '∴ BC ⊥ ______', blankKey: 'k4', options: ['平面 PAB', '平面 PBC', '平面 ABC'], answer: '平面 PAB' },
          { id: 'p5', text: '又 BC ⊂ 平面 PBC', blankKey: 'k5', answer: '' },
          { id: 'p6', text: '∴ 平面 PAB ⊥ 平面 PBC（______）', blankKey: 'k6', options: ['面面垂直判定定理', '线面垂直定义', '面面平行'], answer: '面面垂直判定定理' },
        ],
      },
    },
    extensionLevel: {
      title: '拓展题',
      problem: '四棱锥 P-ABCD 中，底面 ABCD 是正方形，PA ⊥ 底面 ABCD，PA = AB，E 为 PB 中点。求证：平面 AEC ⊥ 平面 PBD。',
      hints: [
        '提示1：设 AC ∩ BD = O，连接 EO，考虑线面关系',
        '提示2：证明 AC ⊥ 平面 PBD',
        '提示3：由 AC ⊥ BD，AC ⊥ PO，可得 AC ⊥ 平面 PBD',
        '提示4：AC ⊂ 平面 AEC，由面面垂直判定定理得证',
      ],
    },
  },
  module6: {
    mindMap: [
      {
        id: 'root',
        label: '平面与平面垂直',
        children: [
          {
            id: 'n1',
            label: '二面角',
            children: [
              { id: 'n11', label: '定义：从一条直线出发的两个半平面' },
              { id: 'n12', label: '记法：α-l-β / α-AB-β / P-l-Q' },
              { id: 'n13', label: '平面角：顶点在棱上，两边垂直于棱' },
              { id: 'n14', label: '分类：锐/直/钝/平二面角' },
            ],
          },
          {
            id: 'n2',
            label: '直二面角',
            children: [
              { id: 'n21', label: '平面角 = 90°' },
              { id: 'n22', label: '两平面互相垂直' },
            ],
          },
          {
            id: 'n3',
            label: '面面垂直判定定理',
            children: [
              { id: 'n31', label: '文字语言：一个平面过另一平面的垂线' },
              { id: 'n32', label: '符号语言：a⊥α, a⊂β ⇒ α⊥β' },
              { id: 'n33', label: '简记：线面垂直 ⇒ 面面垂直' },
            ],
          },
        ],
      },
    ],
    challengeGame: {
      questions: [
        { id: 'g1', statement: '两个平面垂直，则一个平面内的任意直线都垂直于另一个平面。', answer: false, analysis: '错误。只有垂直于交线的直线才垂直于另一个平面。' },
        { id: 'g2', statement: '二面角的平面角大小与顶点在棱上的位置无关。', answer: true, analysis: '正确。平面角大小只由二面角的张角决定，与顶点位置无关。' },
        { id: 'g3', statement: '如果一条直线垂直于一个平面，那么过这条直线的任意平面都与该平面垂直。', answer: true, analysis: '正确。由面面垂直判定定理直接得出。' },
        { id: 'g4', statement: '二面角的平面角两边可以不垂直于棱。', answer: false, analysis: '错误。平面角的两边必须都垂直于棱，这是定义要求。' },
        { id: 'g5', statement: '两个平面垂直，过第一个平面内一点作第二个平面的垂线，垂足一定在交线上。', answer: true, analysis: '正确。这是面面垂直的性质定理。' },
      ],
      badgeName: '证明能手',
    },
    homework: [
      { id: 'h1', level: 'basic', title: '基础任务', description: '完成教材第81页习题 1、2、3 题' },
      { id: 'h2', level: 'practice1', title: '实践任务一', description: '折纸拍照：折出 60° 二面角并拍照记录' },
      { id: 'h3', level: 'practice2', title: '实践任务二', description: '实物拍摄：寻找生活中的面面垂直实例并拍照' },
    ],
    ending: {
      summary: '本节课我们学习了二面角的概念、平面角的作法，以及面面垂直的判定定理。掌握"线面垂直 ⇒ 面面垂直"的转化思想是关键！',
      congratulation: '恭喜你完成本节课学习，继续加油！',
    },
  },
}