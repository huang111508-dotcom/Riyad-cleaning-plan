import { Department, Task } from './types';

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    "name": {
      "en": "Fruit & Veg (Produce)",
      "cn": "果蔬生鲜部"
    },
    "roles": [
      {
        "id": "role_produce_clerk",
        "name": {
          "en": "Fruit & Veg Worker",
          "cn": "果蔬理货员"
        }
      },
      {
        "name": {
          "en": "Produce Area Cleaner",
          "cn": "果蔬保洁员"
        },
        "id": "role_produce_cleaner"
      }
    ],
    "id": "dept_produce"
  },
  {
    "roles": [
      {
        "id": "role_meat_clerk",
        "name": {
          "en": "Meat Counter Staff",
          "cn": "鲜肉理货员"
        }
      },
      {
        "name": {
          "en": "Fish & Seafood Staff",
          "cn": "水产海鲜员"
        },
        "id": "role_seafood_clerk"
      }
    ],
    "id": "dept_meat_seafood",
    "name": {
      "en": "Meat & Fish (Seafood)",
      "cn": "肉类与水产部"
    }
  },
  {
    "roles": [
      {
        "name": {
          "en": "Shelf Restocker",
          "cn": "货架理货员"
        },
        "id": "role_shelf_clerk"
      },
      {
        "name": {
          "en": "Milk & Drink Chiller Staff",
          "cn": "冷饮乳品员"
        },
        "id": "role_dairy_chiller"
      }
    ],
    "id": "dept_grocery",
    "name": {
      "en": "Grocery & Dairy Shelves",
      "cn": "食品百货与冷饮部"
    }
  },
  {
    "name": {
      "en": "Hot Food & Bakery",
      "cn": "熟食与烘焙部"
    },
    "id": "dept_deli_bakery",
    "roles": [
      {
        "name": {
          "en": "Hot Food / Deli Worker",
          "cn": "熟食操作员"
        },
        "id": "role_deli_clerk"
      },
      {
        "id": "role_bakery_clerk",
        "name": {
          "en": "Bakery Helper",
          "cn": "烘焙操作员"
        }
      }
    ]
  },
  {
    "roles": [
      {
        "id": "role_cashier",
        "name": {
          "en": "Cashier",
          "cn": "收银员"
        }
      },
      {
        "id": "role_cart_helper",
        "name": {
          "en": "Shopping Cart Helper",
          "cn": "手推车理货员"
        }
      }
    ],
    "name": {
      "en": "Cashier & Front Desk",
      "cn": "收银与前台服务"
    },
    "id": "dept_front_cashier"
  },
  {
    "id": "dept_cleaning_stock",
    "roles": [
      {
        "id": "role_floor_cleaner",
        "name": {
          "en": "Floor Cleaner",
          "cn": "卖场保洁员"
        }
      },
      {
        "name": {
          "en": "Stockroom & Receiving Staff",
          "cn": "仓库收货员"
        },
        "id": "role_stockroom_staff"
      }
    ],
    "name": {
      "en": "Store Cleaning & Backroom",
      "cn": "卖场保洁与收货仓"
    }
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    "id": "task_produce_cleaner_daily",
    "deptId": "dept_produce",
    "details": {
      "en": "1. Check fruit area often. Use squeegee and dry mop to keep floor dry.\n2. Pick up dropped leaves, peelings, and plastic bags from the floor.\n3. Empty trash cans when 2/3 full and put in new trash bags.",
      "cn": "1. 随时巡视果蔬区，用刮水器和干拖把擦干地面水迹。\n2. 捡走掉在地上的菜叶、果皮和塑料袋。\n3. 垃圾桶装满三分之二时及时更换新垃圾袋。"
    },
    "frequency": "daily",
    "roleId": "role_produce_cleaner",
    "title": {
      "en": "Mop Wet Floor & Empty Trash",
      "cn": "果蔬区地面推干与垃圾清倒"
    }
  },
  {
    "deptId": "dept_produce",
    "dayOfWeek": 4,
    "title": {
      "en": "Wash Scale Counter & Anti-Slip Mats",
      "cn": "刷洗果蔬称重台与防滑地垫"
    },
    "frequency": "weekly",
    "id": "task_produce_cleaner_weekly",
    "roleId": "role_produce_cleaner",
    "details": {
      "en": "1. Wipe weight scale tray, screen, and barcode printer with warm wet cloth.\n2. Take rubber floor mats outside. Scrub with brush and hose water, then hang dry.\n3. Wipe roll-bag stand and fruit packing table clean.",
      "cn": "1. 用温水擦净电子秤托盘、屏幕和贴打标机灰尘。\n2. 将防滑橡胶垫搬到室外，用水枪和刷子刷洗沥干。\n3. 擦净果蔬区包装台面及连卷袋架。"
    }
  },
  {
    "frequency": "monthly",
    "deptId": "dept_produce",
    "dayOfWeek": 4,
    "title": {
      "en": "Wipe Hanging Signs & Pole Bumpers",
      "cn": "清洗果蔬高处标牌与立柱护角"
    },
    "id": "task_produce_cleaner_monthly",
    "roleId": "role_produce_cleaner",
    "weekOfMonth": 3,
    "details": {
      "en": "1. Wipe dust off hanging fruit signs and price boards.\n2. Scrub dirt off pillar corner guards and metal rails.\n3. Clean water scale off fruit mist nozzles.",
      "cn": "1. 擦拭果蔬区高处价格牌、导购吊牌表面积尘。\n2. 刷洗卖场立柱防撞角和铁质护栏污渍。\n3. 清理果蔬喷雾设备喷嘴水垢。"
    }
  },
  {
    "frequency": "daily",
    "deptId": "dept_produce",
    "id": "task_produce_daily_1",
    "title": {
      "en": "Pick Bad Fruits & Wipe Shelves",
      "cn": "挑拣烂果与擦拭货架"
    },
    "details": {
      "en": "1. Pick out bad, soft, or rotten fruits and vegetables. Put them in the waste box.\n2. Wipe display tables and shelves clean with a wet cloth.\n3. Mop floor dry so customers do not slip.",
      "cn": "1. 挑出所有烂果、发霉或变软蔬菜，放入损耗筐。\n2. 用干净湿毛巾擦净水果台面与货架层板。\n3. 拖干地面水渍，防止顾客滑倒摔伤。"
    },
    "roleId": "role_produce_clerk"
  },
  {
    "id": "task_produce_weekly_1",
    "roleId": "role_produce_clerk",
    "frequency": "weekly",
    "details": {
      "en": "1. Take plastic fruit baskets to wash sink. Scrub with soap and water, then rinse clean.\n2. Turn off cooler switch. Wipe dust off air vent covers with a cloth.\n3. Let baskets dry completely, then put them back on shelves.",
      "cn": "1. 把塑料陈列筐拿到清洗池，用肥皂水刷洗并冲干净。\n2. 关掉冷风柜电源，用抹布擦拭出风口防尘网灰尘。\n3. 果筐晾干后整齐码回货架。"
    },
    "dayOfWeek": 2,
    "title": {
      "en": "Wash Fruit Baskets & Air Vents",
      "cn": "刷洗果蔬塑料筐与冷风口"
    },
    "deptId": "dept_produce"
  },
  {
    "weekOfMonth": 1,
    "id": "task_produce_monthly_1",
    "deptId": "dept_produce",
    "dayOfWeek": 2,
    "frequency": "monthly",
    "title": {
      "en": "Deep Clean Cool Room & Floor Drain",
      "cn": "深度冲洗果蔬冷库与地沟"
    },
    "roleId": "role_produce_clerk",
    "details": {
      "en": "1. Move floor boards out. Wash cool room floor and corners with water hose.\n2. Open floor drain covers. Remove rotten leaves and mud. Pour sanitizer water in.\n3. Wipe black mold off door rubber seal and dry.",
      "cn": "1. 搬出冷库垫板，用水管彻底冲洗冷库地面和墙角。\n2. 打开地沟盖板，清理烂菜叶与泥沙，倒入消毒水。\n3. 擦洗冷库大门胶条，去除霉斑并擦干。"
    }
  },
  {
    "deptId": "dept_meat_seafood",
    "frequency": "daily",
    "id": "task_meat_daily_1",
    "title": {
      "en": "Wash Meat Knives & Clean Glass",
      "cn": "刀具砧板消毒与擦拭冷柜玻璃"
    },
    "roleId": "role_meat_clerk",
    "details": {
      "en": "1. After work, scrub all knives and cutting boards with hot soapy water. Spray alcohol and hang to dry.\n2. Wipe meat display glass inside and out. Leave no grease or fingerprints.\n3. Scrape meat grease off metal table and empty the trash bin.",
      "cn": "1. 收市后用热水和洗洁精彻底刷洗所有刀具、砧板，喷酒精挂起。\n2. 用专用玻璃水擦干净鲜肉冷柜前后玻璃，无指纹油污。\n3. 刮净不锈钢台面碎肉油脂，倒空垃圾桶。"
    }
  },
  {
    "deptId": "dept_meat_seafood",
    "id": "task_meat_weekly_1",
    "details": {
      "en": "1. Unplug power cord. Take off meat grinder screws, blades, and plates.\n2. Wash away all leftover meat with warm water. Spray safe food sanitizer.\n3. Wash bone saw tray. Dry well and put back together with safe food oil.",
      "cn": "1. 拔掉电源插头，拆下绞肉机螺杆、刀片和孔板。\n2. 用温水洗净缝隙肉渣，喷食品级消毒液。\n3. 刷洗锯骨机托盘与碎骨盒，擦干后组装涂食用油防锈。"
    },
    "frequency": "weekly",
    "roleId": "role_meat_clerk",
    "title": {
      "en": "Take Apart & Wash Meat Machines",
      "cn": "拆洗绞肉机与锯骨机"
    },
    "dayOfWeek": 3
  },
  {
    "title": {
      "en": "Defrost Meat Freezer & Scrub Floor",
      "cn": "鲜肉冷库除霜与全面刷洗"
    },
    "deptId": "dept_meat_seafood",
    "id": "task_meat_monthly_1",
    "details": {
      "en": "1. Move meat to backup freezer. Turn off freezer fan power switch.\n2. Scrape soft ice off cooling coils. Do not hit pipes with iron tools.\n3. Scrub freezer floor and walls with hot soap water. Mop dry and turn power back on.",
      "cn": "1. 转移库内肉品，切断冷库风机电源。\n2. 铲除蒸发器表面冰霜，切勿用铁锤敲砸管道。\n3. 用热水洗洁精刷洗冷库地面和墙板，拖干积水。"
    },
    "dayOfWeek": 3,
    "frequency": "monthly",
    "weekOfMonth": 2,
    "roleId": "role_meat_clerk"
  },
  {
    "frequency": "daily",
    "deptId": "dept_meat_seafood",
    "roleId": "role_seafood_clerk",
    "title": {
      "en": "Wash Fish Table & Clean Drain",
      "cn": "冲洗宰杀台与清理鱼鳞地漏"
    },
    "id": "task_seafood_daily",
    "details": {
      "en": "1. Wash fish killing table, knives, and fish scalers clean with water hose.\n2. Pull out floor drain basket. Throw away all fish scales and guts.\n3. Pour bleach sanitizer down the drain to stop fishy smell.",
      "cn": "1. 每天收市用水枪彻底冲洗宰杀台、杀鱼刀和去鳞器。\n2. 打开下水道地漏滤网，掏空鱼鳞鱼内脏残渣。\n3. 往地漏倒入稀释消毒水，消除腥味并盖好盖板。"
    }
  },
  {
    "title": {
      "en": "Scrub Live Fish Tanks & Change Filters",
      "cn": "刷洗活鱼缸内壁与更换过滤棉"
    },
    "frequency": "weekly",
    "roleId": "role_seafood_clerk",
    "dayOfWeek": 1,
    "id": "task_seafood_weekly",
    "details": {
      "en": "1. Scrub algae and dirt off inside glass of fish tanks with soft sponge.\n2. Wash or change the white filter pads in the water filter box.\n3. Check air bubbles and water pumps. Clear away any dirt blocking water flow.",
      "cn": "1. 用海绵擦刷洗活鱼缸玻璃内壁青苔和污迹。\n2. 清洗或更换过滤池第一道白色过滤棉。\n3. 检查增氧泵气石和水泵吸水口，清除堵塞杂物。"
    },
    "deptId": "dept_meat_seafood"
  },
  {
    "details": {
      "en": "1. Empty ice out of the ice machine. Scrub inside walls with clean sanitizer.\n2. Wash dust off ice machine air vent screen.\n3. Flush fish tank water pipes with clean water to prevent green slime blockage.",
      "cn": "1. 倒空制冰机储冰槽，用食品级除垢剂擦洗储冰槽内壁。\n2. 冲洗制冰机冷凝器防尘网，保持通风顺畅。\n3. 循环冲洗水产养殖池水管管路，防止青苔堵塞。"
    },
    "roleId": "role_seafood_clerk",
    "title": {
      "en": "Clean Ice Machine & Flush Water Pipes",
      "cn": "制冰机深度清洗与水产池管路消毒"
    },
    "id": "task_seafood_monthly",
    "weekOfMonth": 4,
    "deptId": "dept_meat_seafood",
    "frequency": "monthly",
    "dayOfWeek": 1
  },
  {
    "roleId": "role_dairy_chiller",
    "id": "task_dairy_daily",
    "title": {
      "en": "Wipe Milk Chiller Shelves & Clean Leaks",
      "cn": "擦拭风幕冷柜层板与破损漏奶清理"
    },
    "details": {
      "en": "1. Check milk and yogurt chillers. Take out leaking cartons and wipe off sticky milk.\n2. Wipe glass door handles and metal frames with a clean damp cloth.\n3. Mop water drops in front of drink chillers so floor is dry.",
      "cn": "1. 检查牛奶酸奶冷柜，挑出胀袋破漏商品，擦净奶渍。\n2. 用湿布擦拭饮料冷柜玻璃拉门手柄及边框。\n3. 擦干冷柜前方地面的冷凝水珠。"
    },
    "frequency": "daily",
    "deptId": "dept_grocery"
  },
  {
    "frequency": "weekly",
    "title": {
      "en": "Clean Chiller Air Vents & Scrape Ice",
      "cn": "清洗冷柜回风口滤网与冷冻卧柜除霜"
    },
    "deptId": "dept_grocery",
    "dayOfWeek": 4,
    "roleId": "role_dairy_chiller",
    "id": "task_dairy_weekly",
    "details": {
      "en": "1. Remove plastic bags or paper tags blocking the bottom air intake of chillers.\n2. Use plastic ice scraper to remove thick ice inside ice cream freezers. Do not use metal.\n3. Wipe fingerprints off sliding glass tops of freezer islands.",
      "cn": "1. 清理立式冷风柜回风口被塑料袋或标签纸堵塞的情况。\n2. 用塑料冰铲刮去雪糕冷冻岛柜内壁厚霜，切勿用金属硬撬。\n3. 擦净岛柜推拉玻璃上的手印污渍。"
    }
  },
  {
    "roleId": "role_dairy_chiller",
    "weekOfMonth": 4,
    "id": "task_dairy_monthly",
    "details": {
      "en": "1. Stack milk crates neatly. Wash spoiled milk stains and dirty water off cool room floor.\n2. Clean the water drip tray under the cooler fan so drain tube does not clog.\n3. Check door handle and safety lock work properly.",
      "cn": "1. 整理乳品冷库托盘，冲洗地面溢出的奶渍与污水。\n2. 清理冷风机下方的冷凝水接水盘，防止排水管堵塞倒灌。\n3. 检查冷库门把手及关门回弹装置是否正常。"
    },
    "frequency": "monthly",
    "title": {
      "en": "Clean Dairy Cool Room & Drain Tray",
      "cn": "清洗乳品冷库地坪与冷风机接水盘"
    },
    "deptId": "dept_grocery",
    "dayOfWeek": 4
  },
  {
    "frequency": "daily",
    "id": "task_shelf_daily",
    "deptId": "dept_grocery",
    "roleId": "role_shelf_clerk",
    "details": {
      "en": "1. Dust shelf boards and product boxes. Straighten all price tags.\n2. If any bag leaks rice/oil or bottle breaks, clean it up right away. Mop floor dry.\n3. Remove empty boxes and trash from walking aisles so customers walk safely.",
      "cn": "1. 用鸡毛掸子扫除货架层板与商品外包装积灰，理顺价格标签。\n2. 如发现包装漏油、漏米或碎瓶破损，立即清理拖干地面。\n3. 清走通道上的纸箱垃圾，保持顾客行走顺畅。"
    },
    "title": {
      "en": "Dust Shelves & Clean Spills",
      "cn": "货架层板掸尘与清理漏撒破包"
    }
  },
  {
    "frequency": "weekly",
    "dayOfWeek": 2,
    "id": "task_shelf_weekly",
    "deptId": "dept_grocery",
    "details": {
      "en": "1. Pull out goods and bottom boards from the lowest shelf level.\n2. Sweep away all dust and dirt gathered under the base shelves.\n3. Mop floor clean. Once dry, put boards and products neatly back.",
      "cn": "1. 移开货架最底层的货物与底挡板。\n2. 用扫把或吸尘器清扫货架底部积累的尘土与碎屑。\n3. 拖净地面，待地面干透后将挡板与商品复位。"
    },
    "title": {
      "en": "Clean Under Bottom Shelves",
      "cn": "移开底板清扫货架底部死角"
    },
    "roleId": "role_shelf_clerk"
  },
  {
    "title": {
      "en": "Wipe High Shelf Tops & Aisle Signs",
      "cn": "擦拭高层货架顶板与导购灯箱"
    },
    "roleId": "role_shelf_clerk",
    "weekOfMonth": 3,
    "details": {
      "en": "1. Use a safety ladder to wipe dust off top shelf roofs. Stand carefully.\n2. Wipe dust off hanging aisle category signs and light covers.\n3. Check shelf safety pins and corner guards are tight and safe.",
      "cn": "1. 使用安全梯登高擦拭货架最顶层积尘，必须踩稳站牢。\n2. 擦除通道分类指示牌、灯箱外罩表面的灰尘。\n3. 检查货架安全插销与防撞护角是否牢固。"
    },
    "deptId": "dept_grocery",
    "frequency": "monthly",
    "id": "task_shelf_monthly",
    "dayOfWeek": 2
  },
  {
    "deptId": "dept_deli_bakery",
    "details": {
      "en": "1. Scrape dough and flour off stainless steel table. Wipe clean with wet towel.\n2. Brush bread crumbs off baking pans. Stack pans neatly on rack.\n3. Sweep bakery floor clean. Empty plastic wrap and paper trash cans.",
      "cn": "1. 刮净不锈钢操作台面上的面粉与面团，用湿毛巾擦净。\n2. 用毛刷清扫烤盘残渣碎屑，整齐叠放在烤盘架上。\n3. 清扫烘焙间地面，倒空包装碎料垃圾桶。"
    },
    "title": {
      "en": "Clean Bread Crumbs & Wipe Tables",
      "cn": "清理烤盘碎屑与擦拭工作台"
    },
    "id": "task_bakery_daily",
    "roleId": "role_bakery_clerk",
    "frequency": "daily"
  },
  {
    "frequency": "weekly",
    "title": {
      "en": "Clean Dough Mixer & Proofer Box",
      "cn": "深度清洁和面机与发酵箱"
    },
    "roleId": "role_bakery_clerk",
    "dayOfWeek": 5,
    "details": {
      "en": "1. Unplug dough mixer. Scrape dry dough off hook and bowl. Wipe clean with warm water.\n2. Wipe water and scale out of bottom of proofer box. Clean inside glass door.\n3. Clean bread crumbs off bread slicer blades.",
      "cn": "1. 拔掉和面机电源，刮净搅拌钩与搅拌桶干面皮，用温水擦净。\n2. 清理发酵箱底盘积水和水垢，擦洗内外玻璃拉门。\n3. 擦拭土司切片机刀片缝隙面包屑。"
    },
    "id": "task_bakery_weekly",
    "deptId": "dept_deli_bakery"
  },
  {
    "roleId": "role_bakery_clerk",
    "title": {
      "en": "Clean Oven Inside & Wash Flour Sifters",
      "cn": "烤箱内部去积碳与清洗面粉筛"
    },
    "frequency": "monthly",
    "dayOfWeek": 5,
    "details": {
      "en": "1. When oven is completely cold, wipe inside walls and racks with oven cleaner.\n2. Wash flour sifter screens. Check there are no tears or holes, then dry.\n3. Sweep dust and flour under ingredient shelves in baking stockroom.",
      "cn": "1. 待烤箱完全冷却后，用烤箱专用去碳清洁剂擦拭内壁与烤网。\n2. 拆洗面粉过筛机滤网，检查无破损破洞后晾干。\n3. 彻底清扫原料仓库面粉糖包货架底部。"
    },
    "deptId": "dept_deli_bakery",
    "weekOfMonth": 1,
    "id": "task_bakery_monthly"
  },
  {
    "frequency": "daily",
    "roleId": "role_deli_clerk",
    "title": {
      "en": "Wash Food Trays & Clean Food Warmer",
      "cn": "清洗熟食托盘与擦拭保温展示柜"
    },
    "id": "task_deli_daily",
    "deptId": "dept_deli_bakery",
    "details": {
      "en": "1. Collect metal trays and food tongs. Wash in hot soapy water and sanitize.\n2. Unplug food warmer. Wipe oily inside walls and glass sliding door.\n3. Empty oil drip tray, wash it clean, and dry.",
      "cn": "1. 收回所有不锈钢托盘、熟食夹，用热水洗洁精刷净消毒。\n2. 拔掉保温柜电源，擦拭内部油渍和玻璃推拉门。\n3. 倒掉接油盘废油并洗净晾干。"
    }
  },
  {
    "details": {
      "en": "1. Wait until cooking oil is cool. Open valve to drain old oil into waste oil drum.\n2. Add warm water and degreaser. Scrub inside tank and heating tubes with brush.\n3. Wipe dry completely with clean towel. Make sure no water drops remain, then pour fresh oil.",
      "cn": "1. 待炸油冷却后，打开排油阀将废油排入专用废油桶。\n2. 注入温水和去油剂，用毛刷彻底洗去锅壁和加热管油垢。\n3. 用干抹布彻底擦干内胆，确保无水珠后重新注入新油。"
    },
    "title": {
      "en": "Drain Fryer Oil & Scrub Heating Tubes",
      "cn": "排空炸炉废油与刷洗内胆加热管"
    },
    "deptId": "dept_deli_bakery",
    "frequency": "weekly",
    "dayOfWeek": 3,
    "id": "task_deli_weekly",
    "roleId": "role_deli_clerk"
  },
  {
    "frequency": "monthly",
    "weekOfMonth": 2,
    "roleId": "role_deli_clerk",
    "dayOfWeek": 3,
    "title": {
      "en": "Clean Exhaust Grease Filters & Sink Trap",
      "cn": "拆洗排油烟罩滤油网与下水油水分离器"
    },
    "id": "task_deli_monthly",
    "details": {
      "en": "1. Take down metal grease filters from exhaust hood. Soak in degreaser water for 30 minutes, then scrub clean.\n2. Open grease trap box under the sink. Scoop out top oil and bottom food waste.\n3. Scrub oily kitchen wall tiles with hot soapy water.",
      "cn": "1. 拆下排油烟罩的所有不锈钢油网，浸泡去油溶液30分钟后刷净。\n2. 打开水槽下方的油水分离器，舀出浮油与沉渣。\n3. 冲洗熟食操作间瓷砖墙壁油污。"
    },
    "deptId": "dept_deli_bakery"
  },
  {
    "deptId": "dept_front_cashier",
    "title": {
      "en": "Wipe Cart Handles & Stack Baskets",
      "cn": "推车扶手消毒与手提篮整理"
    },
    "details": {
      "en": "1. Wipe plastic push handles of shopping carts with sanitizer cloth.\n2. Check inside cart baskets. Pick out left receipts, trash, or wrappers.\n3. Stack shopping baskets neatly at entrance. Keep stacks low and safe.",
      "cn": "1. 用消毒湿巾擦拭每辆手推车的塑料推手横把。\n2. 检查车筐内是否有垃圾、小票或果皮，及时清理。\n3. 将顾客手提篮整齐叠放在入口处，堆码高度不超过腰部。"
    },
    "frequency": "daily",
    "id": "task_cart_daily",
    "roleId": "role_cart_helper"
  },
  {
    "dayOfWeek": 5,
    "frequency": "weekly",
    "details": {
      "en": "1. Gather all plastic shopping baskets. Scrub handles and basket bottoms with soap water.\n2. Rinse clean with fresh water and turn upside down to dry.\n3. Pick out any broken or cracked baskets for replacement.",
      "cn": "1. 集中所有塑料购物篮，用温水和洗洁精刷洗提手与篮底灰尘。\n2. 用清水冲净后倒扣晾干。\n3. 挑出把手断裂或篮底破损的不合格篮子报废。"
    },
    "roleId": "role_cart_helper",
    "title": {
      "en": "Wash Red Shopping Baskets",
      "cn": "清洗红色手提购物篮"
    },
    "id": "task_cart_weekly",
    "deptId": "dept_front_cashier"
  },
  {
    "title": {
      "en": "Clean Cart Wheels & Wash Metal Carts",
      "cn": "手推车轮子清理与冲洗车身"
    },
    "details": {
      "en": "1. Check all cart wheels. Cut off hair strings or plastic threads tangled on wheel axles.\n2. Wash metal cart frames outside with water hose to remove dirt.\n3. Add machine oil to stiff wheels so carts roll smoothly and quietly.",
      "cn": "1. 逐一检查手推车四轮，清理缠绕在车轮轴上的头发丝与塑料绳。\n2. 用高压水枪在室外集中冲洗手推车金属网篮上的污垢。\n3. 对卡顿轮轴点注润滑油，确保推车顺滑无噪音。"
    },
    "roleId": "role_cart_helper",
    "id": "task_cart_monthly",
    "deptId": "dept_front_cashier",
    "dayOfWeek": 5,
    "weekOfMonth": 2,
    "frequency": "monthly"
  },
  {
    "details": {
      "en": "1. Gently wipe touch screen, barcode scanner, and receipt printer with cleaning wipe.\n2. Turn on conveyor belt. Hold a damp cloth on the moving belt to wipe off dirt.\n3. Clean packaging counter and empty receipt paper trash bin.",
      "cn": "1. 用微湿酒精湿巾轻擦收银触控屏、扫码枪与小票机表面。\n2. 启动传送带，用湿抹布按住跑带表面擦除污迹。\n3. 清理打包台台面，倒掉小票纸屑杂物桶。"
    },
    "frequency": "daily",
    "deptId": "dept_front_cashier",
    "id": "task_cashier_daily",
    "roleId": "role_cashier",
    "title": {
      "en": "Wipe Cashier Screen & Belt",
      "cn": "收银机屏幕与传送带擦拭"
    }
  },
  {
    "details": {
      "en": "1. Wipe flat glass on barcode scanner clean. Leave no fingerprints or tape glue.\n2. Take out cash drawer. Wipe out coin dust and dirt from the bottom.\n3. Wipe metal queue guide rails and lane barrier gates clean.",
      "cn": "1. 擦干净台式扫码平台玻璃窗，无手印胶渍，保证扫码灵敏。\n2. 拿出口袋钱箱，用干布擦去底部硬币灰尘与纸屑。\n3. 擦洗收银通道防撞隔离栏与顾客排队挡板。"
    },
    "title": {
      "en": "Clean Scanner Glass & Cash Drawer",
      "cn": "清理扫码玻璃窗与收银钱箱抽屉"
    },
    "roleId": "role_cashier",
    "dayOfWeek": 1,
    "id": "task_cashier_weekly",
    "frequency": "weekly",
    "deptId": "dept_front_cashier"
  },
  {
    "id": "task_cashier_monthly",
    "roleId": "role_cashier",
    "frequency": "monthly",
    "dayOfWeek": 1,
    "title": {
      "en": "Clean Under Cash Register & Security Gates",
      "cn": "深度擦拭收银机柜内线缆与防盗门"
    },
    "details": {
      "en": "1. Open lower cabinet under cashier desk. Dust computer box and tidy power cables.\n2. Wipe dust and dirt off EAS anti-theft security alarm gates at exit doors.\n3. Wipe and sanitize coin change return cups.",
      "cn": "1. 打开收银柜下门，理顺线缆，清理主机箱表面和电源插座灰尘。\n2. 彻底擦净超市出口防盗报警立柱（EAS）表面及底座积灰。\n3. 检查零钱找零槽并消毒。"
    },
    "deptId": "dept_front_cashier",
    "weekOfMonth": 1
  },
  {
    "frequency": "daily",
    "roleId": "role_floor_cleaner",
    "details": {
      "en": "1. Clean main supermarket aisles with floor scrubber machine before and after open hours.\n2. Mop tight corners by hand. Put out yellow \"Wet Floor / Caution\" warning signs.\n3. Change plastic trash bags when trash cans are 2/3 full.",
      "cn": "1. 早晚开店前后使用驾驶/手推洗地机清洗卖场大通道地面。\n2. 拐角和死角用大拖把人工拖净，放好防滑小心地滑提示牌。\n3. 卖场内所有垃圾桶袋满三分之二即更换新袋。"
    },
    "title": {
      "en": "Machine Wash Floors & Empty Trash Cans",
      "cn": "洗地机清洗主通道与清空垃圾桶"
    },
    "id": "task_floor_daily",
    "deptId": "dept_cleaning_stock"
  },
  {
    "id": "task_floor_weekly",
    "frequency": "weekly",
    "dayOfWeek": 3,
    "deptId": "dept_cleaning_stock",
    "title": {
      "en": "Deep Clean Restrooms & Sinks",
      "cn": "深度刷洗卫生间蹲坑与洗手台"
    },
    "roleId": "role_floor_cleaner",
    "details": {
      "en": "1. Spray toilet cleaner. Scrub inside toilets and urinals with toilet brush.\n2. Scrub sink bowls with sponge. Wipe water faucets shiny and clean.\n3. Mop bathroom floor and wall tiles. Refill toilet paper rolls and liquid hand soap.",
      "cn": "1. 喷洒洁厕剂彻底刷洗马桶、蹲便器内壁与边缘黄色尿垢。\n2. 用海绵擦除洗手池水垢，擦亮不锈钢水龙头。\n3. 拖净卫生间墙面瓷砖与地面，补足卫生纸与洗手液。"
    }
  },
  {
    "weekOfMonth": 3,
    "details": {
      "en": "1. Wash supermarket glass entrance doors on both sides with glass squeegee.\n2. Turn off door air curtain fan power. Brush thick dust off the air intake screen.\n3. Hose down entrance dirt-trap door mats with water and let dry.",
      "cn": "1. 用双面玻璃刮彻底擦洗超市出入口玻璃大门，无水印手印。\n2. 切断门口风幕机电源，用梯子清理吸风铁网厚积尘。\n3. 高压冲洗出入口吸水刮泥地垫，晾干复位。"
    },
    "id": "task_floor_monthly",
    "roleId": "role_floor_cleaner",
    "dayOfWeek": 3,
    "title": {
      "en": "Wipe Entrance Glass & Air Curtain",
      "cn": "擦拭超市玻璃大门与清洗风幕机"
    },
    "frequency": "monthly",
    "deptId": "dept_cleaning_stock"
  },
  {
    "frequency": "daily",
    "deptId": "dept_cleaning_stock",
    "id": "task_stock_daily",
    "roleId": "role_stockroom_staff",
    "title": {
      "en": "Clear Waste Boxes & Sweep Walkways",
      "cn": "清理收货月台纸箱与清扫仓库通道"
    },
    "details": {
      "en": "1. Flatten empty cardboard boxes after unloading goods. Tie neatly for recycling.\n2. Sweep receiving dock and stockroom aisles. Pick up plastic shrink wrap and tape.\n3. Never block fire exits or fire hose cabinets with pallets or goods.",
      "cn": "1. 卸货完毕后立即压平废弃纸箱，用打包机捆扎整齐。\n2. 清扫收货月台与后仓主通道，不乱丢塑料缠绕膜或封箱胶带。\n3. 消防栓前和安全出口严禁堆放任何货物。"
    }
  },
  {
    "deptId": "dept_cleaning_stock",
    "title": {
      "en": "Clean Pallet Jack Wheels & Stack Pallets",
      "cn": "清洁手动叉车轮子与整理木托盘"
    },
    "roleId": "role_stockroom_staff",
    "id": "task_stock_weekly",
    "frequency": "weekly",
    "details": {
      "en": "1. Cut off tape and ropes caught in wheels of manual pallet jacks (pump trucks).\n2. Stack empty wood pallets neatly. Do not stack higher than 1.5 meters.\n3. Keep forklift battery charging area clean and free of tripping cords.",
      "cn": "1. 清理手动地牛（液压叉车）滚轮上缠绕的胶带与绳子。\n2. 将空木托盘按规格整齐码放，单堆高度不得超过1.5米。\n3. 检查仓库充电桩区域地面，防止电线绊倒。"
    },
    "dayOfWeek": 4
  },
  {
    "frequency": "monthly",
    "dayOfWeek": 4,
    "id": "task_stock_monthly",
    "deptId": "dept_cleaning_stock",
    "weekOfMonth": 4,
    "details": {
      "en": "1. Use long dusting pole to wipe dust and spider webs off high pallet racks.\n2. Check rodent traps and glue boards along walls. Clear out hidden trash corners.\n3. Inspect warehouse exhaust fan insect screens and wash off dust.",
      "cn": "1. 用长柄除尘掸清理高位仓储货架顶部灰尘与蜘蛛网。\n2. 检查仓库四周墙角的灭鼠饵站与粘鼠板，清理杂物死角。\n3. 检查仓库排气扇百叶窗防虫网，冲洗防尘网。"
    },
    "roleId": "role_stockroom_staff",
    "title": {
      "en": "Dust Warehouse Racks & Pest Check",
      "cn": "仓库高位货架除尘与防鼠防虫检查"
    }
  }
];

export const DAYS_OF_WEEK = [
  { val: 1, label: { cn: '星期一', en: 'Monday' } },
  { val: 2, label: { cn: '星期二', en: 'Tuesday' } },
  { val: 3, label: { cn: '星期三', en: 'Wednesday' } },
  { val: 4, label: { cn: '星期四', en: 'Thursday' } },
  { val: 5, label: { cn: '星期五', en: 'Friday' } },
  { val: 6, label: { cn: '星期六', en: 'Saturday' } },
  { val: 7, label: { cn: '星期日', en: 'Sunday' } },
];

export const WEEKS_OF_MONTH = [
  { val: 1, label: { cn: '第一周', en: 'Week 1' } },
  { val: 2, label: { cn: '第二周', en: 'Week 2' } },
  { val: 3, label: { cn: '第三周', en: 'Week 3' } },
  { val: 4, label: { cn: '第四周', en: 'Week 4' } },
];
