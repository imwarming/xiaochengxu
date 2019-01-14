// pages/shopDetails/shopDetails.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data_type:'1',//商品类型 是否折扣
    goods_id: '19',
    store_id:'',
    goods_imgs:[],
    indicatorDots: true,
    autoplay: true, /*轮播参数*/
    interval: 5000,
    duration: 1000, /*轮播参数*/
    goods_name:'商品名称', //商品名称
    goods_fabulous:'',//点赞数
    goods_max_price:'', //商品最大价格
    goods_price:'', //商品价格
    goods_sales:'', //已售
    is_fabulous:'',
    shop_fee:'',//运费
    goods_promise:[],//商品承诺
    goods_detail:[], //商品底部详情图
    comment:[],//评论
    zan_img:'../../resource/images/dianzan.png',
    buy_show:false,
    sku:[], //商品库存详情
    spec:[], //商品规格详情
    spec_ids:[], //选择规格时加入的spec_id 用作判断
    spec_price:0, //选中后的价格判断
    spec_stock:0, //选中后的库存判断
    sku_id:[], //库存id
    check_spec:[], //选中后的规格,
    type:0, //提交类型 用于判断是否加入购物车还是立即购买
    add_cart:false, //加入购物车
    pay:false, //立即购买
    check_spec:false, //选择规格
    num:1 //商品数量


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    if (options.goods_id){
      this.setData({
        goods_id: options.goods_id,
      })
      console.log(options.goods_id)
    }

    console.log(that)
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    /*获取商品详情*/
    wx.request({
      url: app.globalData.url +'v2/shop/goods/goodsdetails',
      data: {
        goods_id: that.data.goods_id,
      },
      success(res){
        console.log(res)

        that.setData({
          goods_imgs: res.data.d.goods.goods_imgs,
          goods_name: res.data.d.goods.goods_name,
          goods_max_price: res.data.d.goods.goods_max_price,
          goods_price: res.data.d.goods.goods_price,
          goods_sales: res.data.d.goods.goods_sales,
          shop_fee: res.data.d.goods.shop_fee,
          goods_fabulous: res.data.d.goods.goods_fabulous,
          goods_promise:res.data.d.goods.goods_promise,
          zan_img:res.data.d.is_fabulous==1?'../../resource/images/dianzansuccess.png':'../../resource/images/dianzan.png',
          is_fabulous: res.data.d.is_fabulous,
          goods_detail:res.data.d.goods.goods_detail,
          store_id:res.data.d.store.store_id
        })

      },
      error(res){
        console.log(res);
      },
      complete: function (res) { /*完成之后*/
          wx.showToast({
            title: '加载完成',
            icon: 'loading'
          })
       },
    })
    /*获取商品评价*/
    wx.request({
          url:app.globalData.url+'v2/shop/goods/getGoodsComment',
          data:{
            goods_id:that.data.goods_id,
          },
          success(res) {
              console.log(res);
              if(res.data.d.items.length>0){
                  that.setData({
                      comment:res.data.d.items,
                      // comment_fabulous:res.data.d.items
                  })
              }
          },
          error(res) {
              console.log(res);
          }
      })

      /*获取商品规格*/
      wx.request({
          url:app.globalData.url+'v2/shop/goods/getGoodsSpec',
          data:{
              goods_id:that.data.goods_id,
              type:that.data.data_type,
          },
          success(res) {
              console.log(res);
              const data=res.data.d
              that.setData({
                  spec:data.spec,
                  sku:data.sku,
                  spec_stock:data.sku[0].stock,
                  spec_price:data.sku[0].price
              })
          },
          error(res) {
              console.log(res);
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({ title: '商品详情000', }) /*动态修改标题*/
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  dianzan:function(){
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
  comment_dianzan:function(e){
    console.log(this);
    console.log(e.currentTarget);
    const index=e.currentTarget.dataset.index;
    console.log(this.data.comment[index]);
    var comment_fabulous=this.data.comment;
    comment_fabulous[index].fabulous=parseInt(comment_fabulous[index].fabulous)+1;
    comment_fabulous[index].is_fabulous=1;
    this.setData({
        comment:comment_fabulous
    });
  },

  /*规格选择*/
  check:function(e){
      this.setData({
          ischeck:e.currentTarget.dataset.index
      })
      // console.log(e.currentTarget)
      // console.log(e.currentTarget.dataset.index)
      // console.log(e.currentTarget.dataset.id)
      var spec_id=e.currentTarget.dataset.id;
      var group=e.currentTarget.dataset.group;
      var spec_ids=this.data.spec_ids;
      const index=e.currentTarget.dataset.index
      spec_ids.push(spec_id);
      // console.log(spec_ids)
      console.log('1:'+index);
      this.setData({
          spec_ids:spec_ids
      })
      var _spec=this.data.spec;
      for(var i=0;i<_spec.length;i++){
        if(_spec[i].group==group){
            for(var j=0;j<_spec[i].list.length;j++){
              if(_spec[i].list[j].id==spec_id){
                _spec[i].list[j].is_select = 'Y';
              }else{
                _spec[i].list[j].is_select = 'N';
              }
            }
        }
      }
      this.setData({
          spec:_spec
      })
      this.getSpecInfo()
  },

  /*获取商品规格参数*/
  getSpecInfo:function(){
    let checkedValues=[]
    let _spec = this.data.spec;
    for (let i = 0; i < _spec.length; i++) {
      let _checkedObj = {
        group: _spec[i].group,
        id: 0,
        spec_value: ''
      };
      for (let j = 0; j < _spec[i].list.length; j++) {
        if (_spec[i].list[j].is_select=='Y') {
            _checkedObj.id = _spec[i].list[j].id;
            _checkedObj.spec_value = _spec[i].list[j].spec_value;
            //checkedValues.push(_checkedObj);//放在这里，就不用过滤valueId为0的
        }
      }
      checkedValues.push(_checkedObj);
    }
    console.log(checkedValues)
      var check_spec_ids=[];
    for(let i = 0;i<checkedValues.length;i++){
        check_spec_ids.push(checkedValues[i].id)
    }
    console.log(check_spec_ids);
    for(let j = 0;j<this.data.sku.length;j++){
      if(check_spec_ids.sort().toString()==this.data.sku[j].spec_ids.sort().toString()){
        console.log(this.data.sku[j].spec_ids)
        console.log(this.data.sku[j]);
        this.setData({
          spec_price:this.data.sku[j].price,
          spec_stock:this.data.sku[j].stock,
          sku_id:this.data.sku[j].sku_id,
          check_spec:this.data.sku[j].spec_text
        })
      }
    }

    return checkedValues;
  },

  add:function(e){
    //库存判断
      this.setData({
          num:parseInt(this.data.num)+1
      })
  },
  reduce:function(e){
    //最小数量判断
      this.setData({
          num:parseInt(this.data.num)-1
      })
  },
  changeNum:function(e){
    //库存判断 //最小数量判断
      this.setData({
          num:this.data.num+1
      })
  },
  isCheckedAllSpec: function() {  /加入购物车时调用 判断是否已选择全部规格/
    return !this.getSpecInfo().some(function(v) {
      if (v.valueId == 0) {
          return true;
      }
    });
  },

  addToCart:function(){
    this.setData({
        add_cart:true,
        pay:false,
        buy_show:true,
    })
    wx.showToast({
      title: '加入购物车成功'

    })
  },
  Pay:function(){
    wx.showToast({
      title: '立即支付'
    }),
    this.setData({
        buy_show:true,
        add_cart:false,
        pay:true
    })
  },
  sure:function(){ //确认规格选择
      console.log('1')
      console.log(this.data)
    if(this.data.add_cart==true){
      //进行加入购物车ajax操作
        wx.request({
            url: app.globalData.url + 'v2/shop/cart/addcart?access_token=sHik2IF2dK-udKOwf3d9q3y7uJaOmorZj-B5oYZ4pJOyi7iTjol5obqqu25_d5-riZa82oKdi8yE4H2f',
            method:'POST',
            header: {'content-type': 'application/x-www-form-urlencoded'},
            data: {
                num: this.data.num,
                spec:this.data.check_spec,
                type:'normal',
                sku_id:this.data.sku_id.toString()
                //测试用token
                // access_token:'sHik2IF2dK-udKOwf3d9q3y7uJaOmorZj-B5oYZ4pJOyi7iTjol5obqqu25_d5-riZa82oKdi8yE4H2f'
            },
            dataType:'json',
            success(res){
                console.log(res);
                if(res.data.c==0){
                  wx.showToast({
                    title: '加入购物车成功！',
                    icon:'success'
                  })
                }else{
                  wx.showToast({
                      title: res.data.m,
                      icon:'fail'
                  })
                }
            },
            error(res){
                console.log(res);
            }
        })
    }
    if(this.data.pay==true){
        //进行立即购买ajax操作
    }
    if(this.data.pay==true){
        //进行加入规格ajax操作
    }
  },
  hide:function(event){
      this.setData({
          buy_show:false
      })
  },

    ToShopStore:function(e){
        console.log(e)
        console.log(this.data.store_id)
        console.log(e.currentTarget.id)
        var store_id=e.currentTarget.id
        wx.navigateTo({
            url: '../shop_store/shop_store?store_id='+store_id
        })
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
