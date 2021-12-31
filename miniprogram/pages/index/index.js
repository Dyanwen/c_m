const app = getApp() // 全局APP
Page({
  data: {
    images: [],
    address: {
      point: [35.200314320094044, 114.67246882820692], // 地图展示的中心点
      marker: { // 地图当前标记点
        id: 0, // 标记点ID，不用变更
        latitude: 35.200314320094044, // 标记点所在纬度
        longitude: 114.67246882820692, // 标记点所在经度
        width: '18', // 标记点图标宽度
        height: '24' // 标记点图标高度
      },
      local: '河南省长垣县西西酒店(食博园)', // 地址
      time: '2022年01月28日', // 举办时间
      tel: '188 4896 5117' // 联系电话
    },
    photosArr: [
      "https://note.youdao.com/yws/api/personal/file/WEBa0b740f731666f46391ec929303dd462?method=download&shareKey=11566dcccf27a5f1bad1ef0a422c9ab7",
      "https://note.youdao.com/yws/api/personal/file/WEBb2116bf648acd99efc0780ae4423eaf2?method=download&shareKey=3ea96bd1d3fe65dc4a7202b24e941e8c"
    ],
    actors: [
      {
        name: "胡广豪",
        role: "新郎",
        avatar: "https://note.youdao.com/yws/api/personal/file/WEB279aeb99c043ce3c055e83d2858d729a?method=download&shareKey=8bd3bbdca02d39fb319002a3f8e1ca18"
      }, {
        name: "邓艳文",
        role: "新娘",
        avatar: "https://note.youdao.com/yws/api/personal/file/WEB12cfead587d219ea4c50d6f41088d414?method=download&shareKey=57b7a6fbcd3941432b7e9c466753ba00"
      }
    ],
    comments: [
      {
        name: "易洋千玺",
        avatar: "http://p5.itc.cn/images01/20200619/3ba30d993057465984c44517c91456b7.jpeg",
        thumb: 7902,
        message: "世界这么大，人生这么长，总会有个人想让你温柔对待。恭喜你们找到了彼此，往后余生，幸福相伴",
        time: "10-20",
        reply: 8806
      }, {
        name: "胡歌",
        avatar: "https://p1.ssl.qhimg.com/dmfd/380_472_/t0126cb83ef68bc012d.jpg",
        thumb: 7902,
        message: "新婚快乐，愿君与另一半共挽同心结一生，共和相思曲一世。",
        time: "11-09",
        reply: 6606
      }
    ]
  },
  /**
   * 页面加载
   */
  onLoad() {
    // that.init() // 初始化
  },
  /**
   * 初始化加载信息
   */
  async init() {
    const result = await app.call({ name: 'get' }) // 调用云函数，获取当前用户报名状态
    if (typeof result === 'number') {
      that.setData({
        status: result // 将状态存入data，0-未报名，1-报名成功
      })
    } else {
      that.setData({
        status: result.status, // 将状态存入data，0-未报名，1-报名成功
        netdata: result
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '胡广豪&邓艳文的婚礼请柬',
      imageUrl: 'https://note.youdao.com/yws/api/personal/file/WEB77ddd59092299292134fbdfeb22db211?method=download&shareKey=2890b757235c439dd6dbbf8154abc595'
    }
  }
})
