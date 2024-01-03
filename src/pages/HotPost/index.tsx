import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Row } from 'antd';
import Icon, { FullscreenOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react';


import './index.less';

const hotItemTemplate = {
  positionId: '',
  x: 0,
  y: 0,
  w: 50,
  h: 50
}

const HotPostPage: React.FC = () => {
  const [form] = Form.useForm();

  const [moduleAreaConfig, setModuleAreaConfig] = useState({hotZoneConfigList: []})

   // 新增热区区域 --- 根据父元素的索引，添加热区
   const addHotItem = () => {
    const _hotItemTemplate = { ...hotItemTemplate }
    const len = moduleAreaConfig.hotZoneConfigList.length
    const height = 50
    _hotItemTemplate.y = height
    _hotItemTemplate.positionId = `1-${len}`
    moduleAreaConfig.hotZoneConfigList.push(_hotItemTemplate)
    setModuleAreaConfig({...moduleAreaConfig})
  }


  const hotItemMoveAndDrag = (type, sonIndex, arg1, arg2) => {
    //  type: 'move' 移动  'drag' 拉伸  'idChange' id输入框改变 'linkConfigChange' 链接配置改变
    const fatherObj = moduleAreaConfig
    if (fatherObj) {
      const { hotZoneConfigList = [] } = fatherObj || {}
      const targetHotItem = hotZoneConfigList.find((_, index) => index === sonIndex)
      if (!targetHotItem) return
      const item =
        type === 'move'
          ? { x: arg1, y: arg2 }
          : type === 'drag'
          ? { w: arg1, h: arg2 }
          : type === 'idChange'
          ? { id: arg1 }
          : type === 'linkConfigChange'
          ? { config: arg1 }
          : {}
      const newTargetHotItem = { ...targetHotItem, ...item }
      hotZoneConfigList.splice(sonIndex, 1, newTargetHotItem)
      fatherObj.hotZoneConfigList = hotZoneConfigList
      setModuleAreaConfig({...fatherObj})
    }
  }


    // 热区移动
    const onHotSpotMove = (sonIndex, id, e) => {
      const fatherBox = document.querySelector(`#hotspotBase`) // 父盒子
      const box = document.querySelector(`#hotspotBase #hotitem${sonIndex}`) // 子盒子
      if (!fatherBox || !box) return
      // 热区的宽高
      const boxWidth = box.offsetWidth
      const boxHeight = box.offsetHeight
      // 基区的宽高
      const fatherBoxWidth = fatherBox.offsetWidth
      const fatherBoxHeight = fatherBox.offsetHeight

      let oEvent = e
      oEvent.stopPropagation() // 阻止冒泡
      oEvent.preventDefault() // 阻止浏览器默认行为
      console.log("~~~~~~~~~~移动~~~~~~~~~~",e.clientX, e.clientY)

      const disX = oEvent.clientX - box.offsetLeft
      const disY = oEvent.clientY - box.offsetTop
  
      fatherBox.onmousemove = (h) => {
        oEvent = h
        oEvent.preventDefault()
        let x = oEvent.clientX - disX
        let y = oEvent.clientY - disY
  
        // 图形移动的边界判断
        x = x <= 0 ? 0 : x
        x = x >= fatherBoxWidth - boxWidth ? fatherBoxWidth - boxWidth : x
        y = y <= 0 ? 0 : y
        y = y >= fatherBoxHeight - boxHeight ? fatherBoxHeight - boxHeight : y
        hotItemMoveAndDrag('move', sonIndex, x, y)
      }
      // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
      fatherBox.onmouseleave = function () {
        fatherBox.onmousemove = null
        fatherBox.onmouseup = null
      }
      // 鼠标弹起后停止移动
      fatherBox.onmouseup = function () {
        fatherBox.onmousemove = null
        fatherBox.onmouseup = null
      }
    }


      // 热区拉伸
  const onHotSpotDrag = (sonIndex, id, e) => {
    e.stopPropagation() // 阻止冒泡,避免缩放时触发移动事件
    e.preventDefault() // 阻止默认事件

    const fatherBox = document.querySelector(`#hotspotBase`) // 父盒子
    const box = document.querySelector(`#hotspotBase #hotitem${sonIndex}`) // 子盒子

    if (!fatherBox || !box) return

    const _offsetLeft = box.offsetLeft
    const _offsetTop = box.offsetTop

    // 热区的宽高
    const boxWidth = box.offsetWidth
    const boxHeight = box.offsetHeight

    // 基区的宽高
    const fatherBoxWidth = fatherBox.offsetWidth
    const fatherBoxHeight = fatherBox.offsetHeight

    const pos = {
      w: boxWidth,
      h: boxHeight,
      x: e.clientX,
      y: e.clientY
    }
    fatherBox.onmousemove = (ev) => {
      console.log("~~~~~~~~~~onmousemove~~~~~~~~~~", _offsetLeft, _offsetTop)
      ev.preventDefault()
      // 设置图片的最小缩放为30*30
      let w = Math.max(30, ev.clientX - pos.x + pos.w)
      let h = Math.max(30, ev.clientY - pos.y + pos.h)

      // 设置热区的最大宽高
      w = w >= fatherBoxWidth - _offsetLeft ? fatherBoxWidth - _offsetLeft : w
      h = h >= fatherBoxHeight - _offsetTop ? fatherBoxHeight - _offsetTop : h
      hotItemMoveAndDrag('drag', sonIndex, w, h)
    }
    fatherBox.onmouseleave = function () {
      fatherBox.onmousemove = null
      fatherBox.onmouseup = null
    }
    fatherBox.onmouseup = function () {
      fatherBox.onmousemove = null
      fatherBox.onmouseup = null
    }
  }


  const renderHotItem = () => {
    const hotZoneConfigList = moduleAreaConfig.hotZoneConfigList
    return hotZoneConfigList.map((item = {}, index) => {
      const { x, y, w, h, positionId } = item
      return (
        <div
          id={`hotitem${index}`}
          className='hotitem'
          key={`hotitem-${index}`}
          style={{ left: x, top: y, width: w, height: h }}
          onMouseDown={(e) => {
            console.log("~~~~~~~~~~onMouseDown~~~~~~~~~~")
            onHotSpotMove(index, positionId, e)
          }}
        >
          <span className='id-span'>{positionId}</span>
          <FullscreenOutlined
            className='icon-drag'
            onMouseDown={(e) => {
              onHotSpotDrag(index, positionId, e)
            }}
          />
        </div>
      )
    })
  }

  return (
    <PageContainer ghost>
      <Form form={form} labelCol={{ span: 5 }}>
        <Row gutter={24} justify="center">
          <Col span={10}>
            <div className="mb10">
              <span>模块背景图:</span>
            </div>
            <div
              id={`hotspotBase`}
              className="wd375"
              style={{ position: 'relative' }}
            >
              <img
                className="wd375"
                style={{ height: 'auto' }}
                src={'http://47.110.42.63:9000/kfc-test/160157_KFC.jpeg'}
              />
              <div className="mask" />
              {renderHotItem()}
            </div>
          </Col>

          <Col span={14}>
            <Button
              danger
              className="mt20"
              onClick={() => {
                addHotItem()
              }}
            >
              添加热区
            </Button>
          </Col>
        </Row>
      </Form>
    </PageContainer>
  );
};

export default HotPostPage;
