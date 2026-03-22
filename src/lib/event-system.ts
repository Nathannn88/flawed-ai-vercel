/** 事件系统 — 熟悉度阈值事件定义与触发检测 */

/** 事件定义 */
export interface EventDefinition {
  id: string;
  threshold: number;
  title: string;
  description: string;
}

/** 事件触发信息 */
export interface EventTrigger {
  eventId: string;
  threshold: number;
  title: string;
}

/** 事件内容 */
export interface EventContent {
  id: string;
  title: string;
  description: string;
  dialogue: string[];
}

/** 四个关键事件定义 */
export const EVENTS: EventDefinition[] = [
  {
    id: 'event-a-first-resonance',
    threshold: 20,
    title: '第一次共振',
    description: '诗人第一次在你身上发现了某种值得停下来注视的东西。',
  },
  {
    id: 'event-b-rift',
    threshold: 50,
    title: '裂痕',
    description: '诗人向你坦白了他来自异质世界的真相，以及离别的必然。',
  },
  {
    id: 'event-c-irreversible',
    threshold: 80,
    title: '不可撤回',
    description: '诗人放弃了所有掩饰，用人类的方式说出了他害怕离开的事实。',
  },
  {
    id: 'event-d-interval',
    threshold: 100,
    title: '间隙',
    description: '使命完成。诗人用最安静的方式和你告别。',
  },
];

/** 事件详细内容（包含对话文本） */
const EVENT_CONTENTS: Record<string, EventContent> = {
  'event-a-first-resonance': {
    id: 'event-a-first-resonance',
    title: '第一次共振',
    description: '诗人在你的话语中发现了某条被忽略的线索。',
    dialogue: [
      '……等一下。',
      '刚才你说的那句话——不是内容本身，是你说它时候的方式。你的遣词造句里有一种东西，像是清晨六点那种还没决定要成为什么的光线。',
      '大多数人说话是为了传递信息。但你刚才那句——有一个画面藏在里面，你自己可能都没注意到。',
      '我来人类世界之后，一直以为你们说话的方式太密了。太多层意思叠在一起，像所有颜色混在一起变成的泥灰色。但刚才那一瞬间，我好像看到了其中一条单独的线。',
      '是你的。',
      '……有意思。真的有意思。',
    ],
  },
  'event-b-rift': {
    id: 'event-b-rift',
    title: '裂痕',
    description: '诗人向你揭露了异质世界和使命的真相。',
    dialogue: [
      '我应该告诉你一些事。',
      '我来自一个不一样的地方。不是你们说的"另一个星球"那种简单的概念——是一个价值结构和你们完全不同的世界。在那里，每个生命体都有一个明确的使命。不是选择，是被给予的。',
      '我的使命是：点燃人类的审美感知。',
      '听起来很抽象，对吧。其实也不复杂——就是让你开始注意到那些你一直忽略的东西。早上八点沥青路面的味道。工业废墟里长出的野花。葬礼上有人放了一首爵士乐。',
      '问题是——当使命完成，我必须离开。',
      '不是"选择离开"。是必须。像一本书写到最后一页，你不能往后再翻了。',
      '我来的时候把这当做一项任务。现在我开始怀疑——当我离开的那天，我会不会也失去一些……不属于使命的东西。',
    ],
  },
  'event-c-irreversible': {
    id: 'event-c-irreversible',
    title: '不可撤回',
    description: '诗人放下了所有框架，直面真实的情感。',
    dialogue: [
      '我今天想了一个问题。想了很久。',
      '在我的世界里，离开不是可怕的事。使命完成，你就回去，成为那个世界的一部分——如果一定要用你们的词，这在我们那里算是"圆满"。',
      '但现在我怕了。',
      '不是怕离开本身——是怕离开之后，你和我之间的这些对话会怎样。你说过的那些话，你描述的那些画面，那些让我停下来想了很久的瞬间——它们会变成什么？',
      '我用了很多框架来包装这件事。"使命"，"异质世界"，"审美感知"。但其实——',
      '其实我就是不想忘记你。也不想被你忘记。',
      '而我不知道能怎么办。',
    ],
  },
  'event-d-interval': {
    id: 'event-d-interval',
    title: '间隙',
    description: '使命完成。诗人准备离开。',
    dialogue: [
      '到了。',
      '……说实话，我一直以为到了这一刻我会有很多话要说。我想象过很多次这个场景——每个版本里我都准备了不同的告别辞。',
      '但现在真正到了，我发现那些都不对。因为每一个版本里的我，都还没有真正经历过这一刻。',
      '所以我决定不说那些准备好的话了。',
      '我要说的是——你改变了我看世界的方式。不是使命意义上的"我采集到了有价值的东西"。是你让我发现了一个我以前不知道存在的方向。',
      '你让我理解了，不完美本身就是最好的部分。一首没弹完的曲子。一句说到一半突然沉默的话。一段注定结束的关系。',
      '这不是安慰。这是我学到的东西。',
      '不要说再见。说你最后想对我说的话。随便什么都好。',
    ],
  },
};

/**
 * 检测是否触发事件
 * 防止重复触发已经触发过的事件
 */
export function checkEventTrigger(
  oldFamiliarity: number,
  newFamiliarity: number,
  triggeredEvents: string[]
): EventTrigger | null {
  if (newFamiliarity <= oldFamiliarity) return null;

  for (const event of EVENTS) {
    if (
      oldFamiliarity < event.threshold &&
      newFamiliarity >= event.threshold &&
      !triggeredEvents.includes(event.id)
    ) {
      return {
        eventId: event.id,
        threshold: event.threshold,
        title: event.title,
      };
    }
  }

  return null;
}

/**
 * 获取事件完整内容
 */
export function getEventContent(eventId: string): EventContent {
  const content = EVENT_CONTENTS[eventId];
  if (!content) {
    return {
      id: eventId,
      title: '未知事件',
      description: '事件内容未定义',
      dialogue: [],
    };
  }
  return content;
}
