//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '../../resource/images/timg.jpg',
      '../../resource/images/timg.jpg',
      '../../resource/images/timg.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    shop: [
      {
        shop_img: '../../resource/images/timg.jpg',
        shop_title:'商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称'
      },
      {
        shop_img: '../../resource/images/timg.jpg',
        shop_title: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称'
      },
      {
        shop_img: '../../resource/images/timg.jpg',
        shop_title: '商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称商品名称'
      },
    ],
    goods_life:[],
    scrollTop: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../shopDetais/shopDetais'
    })
  },

  toShopDetails: function (event) {
    wx.navigateTo({
      url: '../shopDetails/shopDetails?goods_id=' + event.currentTarget.dataset.id,
    })
  },
  /*回到顶部*/
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    /*获取轮播banner*/
      wx.request({
          url:app.globalData.url + 'v2/shop/banner/index',
          data:{

          },
          success(res){
              console.log(res);
              var data=res.data.d;
              that.setData({
                  imgUrls:data.carousel
              })
          },
          error(res){
              console.log(res);
          }
      })

      /*获取首页分类*/
      wx.request({
          url: app.globalData.tap + 'home/Level/level',
          data: {
          },
          success(res) {
              console.log(res);
              var data=res.data;
              that.setData({
                  goods_life:data.d
              })
              console.log(that.data.goods_life)
          },
          error(res) {
              console.log(res);
          },
      })

    /*请求接口获取后台数据*/
    wx.request({
      url: app.globalData.tap +'home/Shop/ShopGoods',
      data:{
        id:2
      },
      success(res){
        console.log(res)
        if(res.data.c==0){
          if(res.data.d.length==0){
            wx.showToast({
              title: '暂无商品',
              icon: '',
              image: '',
              duration: 0,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }else{
            that.setData({
              shop:res.data.d
            })
          }
        }
      },
      error(res){
        console.log(res)
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
})
