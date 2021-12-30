const app = getApp() // 全局APP
let that = null // 页面this指针
Page({
  data: {
    images: [],
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
    that = this // 页面this指向指针变量
    const { windowHeight, windowWidth } = wx.getSystemInfoSync() // 获取系统屏幕信息
    that.setData({
      noserver: (windowWidth / windowHeight) > 0.6 // 如果宽高比大于0.6，则差不多平板感觉，不适合邀请函的UI
    })
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
  /**
   * 覆盖全局的上下页切换，用于地图和表单组件中，禁用全局上下翻页
   * @param {*} e 页面信息
   */
  changeno(e) {
    if (e.type === 'begin' || e.type === 'touchstart') { // 如果触发状态为触摸开始，或者地图移动开始
      that.no = true // 设置不干预变量为true
    } else if (e.type === 'end' || e.type === 'touchend') { // 如果触发状态未触摸结束，或地图移动结束
      setTimeout(function () { // 延迟100ms设置，防止低端机型的线程强占
        that.no = false // 设置不干预变量为false
      }, 100)
    }
  },
  /**
   * 上下翻页
   * @param {*} e 页面信息
   */
  movepage(e) {
    if (that.no === true) return // 如果不干预变量为true，说明禁用翻页
    const { clientY } = e.changedTouches[0] // 获取触摸点Y轴位置
    if (e.type === 'touchstart') { // 如果是触摸开始
      that.startmove = clientY // 记录一下开始点
    }
    if (e.type === 'touchend') { // 如果是触摸结束
      let { epage } = that.data // 获取data中的结束页
      const spage = that.data.epage // 将结束页传给开始页，要从这里动作
      if (that.startmove > clientY) { // 如果触摸点比初次高
        if (epage < 4) epage++ // 在结束页小于2时加1，因为一共就需翻2页
      } else if (that.startmove < clientY) { // 如果触摸点比初次低
        if (epage > 0) epage-- // 在结束页大于0时减1
      }
      if (spage !== epage) { // 如果初始页和结束页相同，则证明翻到底了，不同才要改变
        that.setData({ // 更新存储
          spage: spage,
          epage: epage
        })
      }
    }
  },
  /**
   * 更新单选框输入值
   * @param {*} e 页面信息
   */
  radioChange(e) {
    const key = `form.${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
    that.setData({ // 更改对应路径为输入信息
      [key]: e.detail.value
    })
  },
  /**
   * 更新输入框输入值
   * @param {*} e 页面信息
   */
  oninput(e) {
    const key = `form.${e.currentTarget.dataset.key}` // 将key值带入，生成改变路径
    that.setData({ // 更改对应路径为输入信息
      [key]: e.detail.value
    })
  },
  /**
   * 提交报名
   */
  async submit() {
    let flag = true // 先设置flag为true，用于检查
    const check = that.data.info.form // 取出form原始结构
    const form = that.data.form // 取出输入的
    for (const i in check) { // 对原始结构进行循环
      if (form[i] == null || form[i] === '') { // 如果原始需要填写的没有写
        wx.showModal({ // 提示要补充
          content: `${check[i].name}未填写，请补充！`,
          showCancel: false
        })
        flag = false // 设置false，跳过提交环节
        break // 退出for循环
      }
    }
    if (flag === true) { // 如果flag=true，证明验证通过
      wx.showLoading({ // 显示加载中
        title: '提交中',
        mask: true
      })
      await app.call({ // 发起云函数，提交信息
        name: 'add',
        data: form
      })
      await that.init() // 更新信息
      wx.hideLoading() // 隐藏加载中
    }
  },
  onShareAppMessage() {
    return {
      title: '婚礼邀请函',
      imageUrl: 'https://note.youdao.com/yws/api/personal/file/WEB77ddd59092299292134fbdfeb22db211?method=download&shareKey=2890b757235c439dd6dbbf8154abc595'
    }
  }
})
