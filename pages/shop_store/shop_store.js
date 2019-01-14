// pages/shop_store/shop_store.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      store_id:'2',
      winHeight:"",//窗口高度
      currentTab:0, //预设当前项的值
      scrollLeft:0, //tab标题的滚动条位置
      goods_type_id:[],
      goods_type:[],
      goods_items:[],
      zan_img:'../../resource/images/dianzan.png', //默认点赞图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo( {
        success: function( res ) {
            var clientHeight=res.windowHeight,
                clientWidth=res.windowWidth,
                rpxR=750/clientWidth;
            var  calc=clientHeight*rpxR-180;
            console.log(calc)
            that.setData( {
                winHeight: calc
            });
        }
    });
    //得到scroll-title列表数据
      wx.request({
          url:app.globalData.url +'v2/shop/Shopgoods/shopColumn',
          data:{
              id:this.data.store_id
          },
          success(res){
              console.log(res)
              var data=res.data.d;
              console.log(data);
              data.type.unshift({
                  id:0,name:'全部',store_id:data.type[0].store_id,user_id:data.type[0].user_id,sort:data.type[0].sort
              })
              that.setData({
                  goods_type:data.type
              })

              that.getGoods_list()
          },
          error(res){
              console.log(res)
          }
      })

  },
  getGoods_list:function(){
    const that=this;
    wx.request({
      url: app.globalData.url + 'v2/shop/Shopgoods/shopGoods',
      data: {
          id:this.data.store_id,
          column:this.data.goods_type_id
      },
      success(res){
          console.log(res);
          that.setData({
              goods_items:res.data.d.items
          })
      },
      error(res){
          console.log(res);
      }
    })
  },

  // 滚动切换标签样式
  switchTab:function(e){
      // const index=e.currentTarget.dataset.index;
      var current = e.detail.current
      var goods_type=this.data.goods_type;
      console.log(goods_type);
      console.log(goods_type[current].id);
      console.log(e)
      var goods_type_id=goods_type[current].id;
      this.setData({
          currentTab:e.detail.current,
          goods_type_id:goods_type_id
      });
      this.checkCor();
      var that=this
      // console.log(e);
      /*获取栏目下的商品*/
      this.getGoods_list();
  },
  // 点击标题切换当前页时改变样式
  swichNav:function(e){
      var cur=e.target.dataset.current;
      if(this.data.currentTab==cur){return false;}
      else{
          this.setData({
              currentTab:cur
          })
      }
      console.log(e);
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor:function(){
      if (this.data.currentTab>3){
          this.setData({
              scrollLeft:300
          })
      }else{
          this.setData({
              scrollLeft:0
          })
      }
  },

  //ToShopDetails前往商品详情页
  ToShopDetails:function(e){
    console.log(e)
      var goods_id=e.currentTarget.id;
      wx.navigateTo({
          url:'../shopDetails/shopDetails?goods_id='+goods_id
      })
  },
  //点赞

  store_dianzan:function(){
      console.log(this)
      console.log(this.data.zan_img)
      if (this.data.is_fabulous =='2'){
          wx.request({
              url: app.globalData.url + 'v2/shop/Fabulous/goodsFabulous',
              data:{
                  id:this.data.goods_id
              },
              success(res){
                  console.log(res)
              },
              error(res){
                  console.log(res)
              }
          })
          this.setData({
              zan_img: '../../resource/images/dianzansuccess.png',
              goods_fabulous: Number(this.data.goods_fabulous)+1,
              is_fabulous:1
          })
      }else{
          this.setData({
              zan_img: '../../resource/images/dianzan.png',
              goods_fabulous: Number(this.data.goods_fabulous)-1,
              is_fabulous:2
          })
      }
  },

  goods_dianzan:function(){
      console.log(this)
      console.log(this.data.zan_img)
      if (this.data.is_fabulous =='2'){
          wx.request({
              url: app.globalData.url + 'v2/shop/Fabulous/goodsFabulous',
              data:{
                  id:this.data.goods_id
              },
              success(res){
                  console.log(res)
              },
              error(res){
                  console.log(res)
              }
          })
          this.setData({
              zan_img: '../../resource/images/dianzansuccess.png',
              goods_fabulous: Number(this.data.goods_fabulous)+1,
              is_fabulous:1
          })
      }else{
          this.setData({
              zan_img: '../../resource/images/dianzan.png',
              goods_fabulous: Number(this.data.goods_fabulous)-1,
              is_fabulous:2
          })
      }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
