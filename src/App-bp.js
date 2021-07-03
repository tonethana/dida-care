
// css & image
// import 'animate.css/animate.css'
import './App.less';
import LogoSongklha from './img/logo-songkhla.png'
import LogoDR from './img/DRii-Logo.png'
import LogoHos from './img/Songklanagarin-Hospital-Icon.png'
import Logoaot from './img/aot.png'
import Logodc from './img/dc.png'
import Logodrii from './img/drii.png'
import Logoppho from './img/ppho.png'
import Logotrain from './img/train.png'
import Logodlt from './img/dlt.png'
import AmphuresJSON from './data/amphures.json'
import ProvinceJSON from './data/provinces.json'
import AmphuresJSON_to from './data/amphures.json'
import ProvinceJSON_to from './data/provinces.json'


// library
import React, { useState } from 'react';
import { Layout } from 'antd';
import { Typography, Space } from 'antd';
import { Row, Col, Divider } from 'antd';
import { Card } from 'antd';
import { Steps } from 'antd';
import { Button } from 'antd';
import { Modal } from 'antd';
import { Comment, Avatar } from 'antd';
import { Form, Input, Radio} from 'antd';
import axios from 'axios';
import { Spin } from 'antd';
import { CheckOutlined, CloseOutlined ,DownOutlined} from '@ant-design/icons';
import moment from 'moment'
import { AutoComplete ,notification } from 'antd';
import QRCode  from 'qrcode.react'
import { connect } from 'react-redux';
import { setzone } from './reducers/actions';

// import { Tabs } from 'antd';
// import { BigNumber } from "bignumber.js";



const { Text, Title } = Typography;
const { Step } = Steps;
const { Footer,  Content } = Layout;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};


function App(props) {

  const [form] = Form.useForm()
  const [type, settype] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [nametype, setnametype] = useState('')
  const [radio, setradio] = useState(4)
  const [current, setCurrent] = React.useState(0);
  const [value,setvalue] = useState(0)
  const [load, setload] = useState(false)
  const [isModalVisible_comfirm, setIsModalVisible_comfirm] = useState(false);
  const [isModalVisible_error, setIsModalVisible_error] = useState(false)
  const [mes, setmes] = useState("กำลังส่งข้อมูล...")
  const [select_District_from,setselect_District_from] = useState([])
  const [select_District_to,setselect_District_to] = useState([])
  const [encode,setencode] = useState('')

  const Amphures_from = AmphuresJSON
  const Province_from = ProvinceJSON

  const Amphures_to = AmphuresJSON_to
  const Province_to = ProvinceJSON_to

  const downloadQR = () => {
    var time = moment().format('DDMMYYHHmm')
    const canvas = document.getElementById('qrcode');
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `SongkhlaCare-${time}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const isAuthenticated = () => {
    var time = moment().format("DDMMYYHHmm");
    try {
      var body = {}
      if(value === 0){
          body = {
            firstname: form.getFieldValue('Firstname'),
            lastname: form.getFieldValue('Lastname'),
            passport: form.getFieldValue('citizen'),
            tel: form.getFieldValue('tel'),
            from_sd: form.getFieldValue('subdistrictsfrom'),
            from_d: form.getFieldValue('districtsfrom'),
            from_p: form.getFieldValue('provincefrom'),
            to_sd: form.getFieldValue('subdistrictsto'),
            to_d: form.getFieldValue('districtsto'),
            to_p: form.getFieldValue('provinceto'),
            date: time,
            type_travel: nametype,
          }
      }else if(value ===1){
          body = {
            firstname: form.getFieldValue('Firstname'),
            lastname: form.getFieldValue('Lastname'),
            passport: form.getFieldValue('passport'),
            tel: form.getFieldValue('tel'),
            from_sd: form.getFieldValue('subdistrictsfrom'),
            from_d: form.getFieldValue('districtsfrom'),
            from_p: form.getFieldValue('provincefrom'),
            to_sd: form.getFieldValue('subdistrictsto'),
            to_d: form.getFieldValue('districtsto'),
            to_p: form.getFieldValue('provinceto'),
            date: time,
            type_travel: nametype,
          }
      }

      const options = {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }

      axios.post('https://songkhlakiosk.et.r.appspot.com/api/send', body,options).then(response => {

        var res = response.data;
        setTimeout(() => {
          setload(false)
          if (res === 'OK') {
            setIsModalVisible_comfirm(true)
          } else {
            setIsModalVisible_error(true)
          }

        }, 2000);
        return res
      })
    } catch (error) {
      //console.error(error);
      return false
    }
  }

  const close_isModalVisible_comfirm = () =>{
      form.resetFields()
      setIsModalVisible_comfirm(false)
      setIsModalVisible_error(false)
      setIsModalVisible(true)
      setCurrent(0)
  }

  const send_data = async () => {
    await isAuthenticated()
    setmes("กำลังส่งข้อมูล....")
    setload(true)
  }

  const error = (text) => {
    var placement = 'bottomRight'
    notification['error']({
      duration:2.5,
      message: <Text className='bold'>{text}</Text>,
      placement
    });
  };

  const validationcitizenid = (id) => {
    if (id === null || id.length !== 13 || !/^[0-9]\d+$/.test(id)) return !1; let i, sum = 0; for ((i = 0), (sum = 0); i < 12; i++) { sum += parseInt(id.charAt(i)) * (13 - i) }
    let check = (11 - sum % 11) % 10; if (check === parseInt(id.charAt(12))) { return !0 }
    return !1
  }


  Number.prototype.toFixedSpecial = function(n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') === -1)
      return str;
  
      str = str.replace('.', '').split('e+').reduce(function(p, b) {
      return p + Array(b - p.length + 2).join(0);

    });
    
    if (n > 0)
      str += '.' + Array(n + 1).join(0);
    
      return str;
  };

  function multiply(a, b) {
    const product = Array(a.length+b.length).fill(0);
    for (let i = a.length; i--; null) {
        let carry = 0;
        for (let j = b.length; j--; null) {
            product[1+i+j] += carry + a[i]*b[j];
            carry = Math.floor(product[1+i+j] / 10);
            product[1+i+j] = product[1+i+j] % 10;
        }
        product[i] += carry;
    }
    return product.join("").replace(/^0*(\d)/, "$1");
}

  const next =async () => {
    const re = /^[0-9\b]+$/;

    try {
      var number = ""
      for(var i=form.getFieldValue('tel').length ; i < 12 ; i++){
        number = "1" + number
      }
      var time = moment().format('DDMMYYHHmm')
      setencode(multiply(number.toString()+form.getFieldValue('tel').toString()+time.toString(), "1108"))

    } catch (error) {
    }

    if (current === 0) {
        if(type !==1){
          if(value===0){
            var res = await validationcitizenid(form.getFieldValue('citizen'))
            if (!res && form.getFieldValue('citizen') !== '') {
              error('กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง')
              return 0;
            }
          }

          if (form.getFieldValue('Firstname') !== undefined && form.getFieldValue('Firstname') !== '' && 
            form.getFieldValue('Lastname') !== undefined && form.getFieldValue('Lastname') !== '' &&
            form.getFieldValue('citizen') !== undefined && form.getFieldValue('citizen') !== '' &&
            form.getFieldValue('tel') !== undefined && re.test(form.getFieldValue('tel')) && parseInt(form.getFieldValue('tel'))!==0 && 
            form.getFieldValue('tel').length === 10 && res === true ) {
            setCurrent(current + 1);
          }else if (form.getFieldValue('Firstname') !== undefined && form.getFieldValue('Firstname') !== '' && 
            form.getFieldValue('Lastname') !== undefined && form.getFieldValue('Lastname') !== '' &&
            form.getFieldValue('passport') !== undefined && form.getFieldValue('passport') !== '' &&
            form.getFieldValue('tel') !== undefined && re.test(form.getFieldValue('tel')) && parseInt(form.getFieldValue('tel'))!==0 && value===1 && form.getFieldValue('tel').length === 10
          ) {
            setCurrent(current + 1);
          } else {
              error('กรุณากรอกข้อมูลให้ถูกต้อง')
          }
        }else if(type ===1){
          if (form.getFieldValue('Firstname') !== undefined && form.getFieldValue('Firstname') !== '' && 
            form.getFieldValue('tel') !== undefined && re.test(form.getFieldValue('tel'))&& parseInt(form.getFieldValue('tel'))!==0 && form.getFieldValue('tel').length == 10 ){
              setCurrent(current + 1);
        }else if (form.getFieldValue('Firstname') !== undefined && form.getFieldValue('Firstname') !== '' && 
            form.getFieldValue('Lastname') !== undefined && form.getFieldValue('Lastname') !== '' &&
            form.getFieldValue('passport') !== undefined && form.getFieldValue('passport') !== '' &&
            form.getFieldValue('tel') !== undefined && re.test(form.getFieldValue('tel')) && parseInt(form.getFieldValue('tel'))!==0 &&value===1&& form.getFieldValue('tel').length == 10
        ) {
          setCurrent(current + 1);
        } else {
            error('กรุณากรอกข้อมูลให้ถูกต้อง')
        }

        }


    } else if (current === 1) {
        if (
          // form.getFieldValue('subdistrictsfrom') !== '' && form.getFieldValue('subdistrictsfrom') !== undefined &&
          // form.getFieldValue('subdistrictsto') !== '' && form.getFieldValue('subdistrictsto') !== undefined &&
          form.getFieldValue('districtsfrom') !== '' &&  form.getFieldValue('districtsfrom') !== undefined &&
          form.getFieldValue('provincefrom') !== '' && form.getFieldValue('provincefrom') !== undefined &&
          form.getFieldValue('districtsto') !== '' && form.getFieldValue('districtsto') !== undefined &&
          form.getFieldValue('provinceto') !== '' && form.getFieldValue('provinceto') !== undefined
        ) {
          // setmes("กรุณากรอกข้อมูลให้ถูกต้อง")
          try{

            var body = {
               from_p: form.getFieldValue('provincefrom'),
               zone_id: '3'
             }
      
             const options = {
               headers: {
                 'Access-Control-Allow-Origin': '*',
               },
             }
      
             axios.post('https://songkhlakiosk.et.r.appspot.com/api/checkzone', body,options).then(response => {
      
               props.dispatch(setzone(response))
               
             })
           } catch (error) {
             //console.error(error);
             return false
           }

          setCurrent(current + 1);
        } else {
          error('กรุณากรอกข้อมูลให้ถูกต้อง')
        }

    }

  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };


  const selected_District_from =(e)=>{
    var id =0
    var i=0
  
    for (i = 0; i < Province_from.length; i++){
      if (Province_from[i].value == e){
          id = Province_from[i].province_id
      }
    }
    var obj =[]
    var num = Amphures_from.length
    for (i = 0; i < num; i++){
      if (Amphures_from[i].province_id == id){
          var data = {province_id:Amphures_from[i].province_id,value:Amphures_to[i].value+" /"+Amphures_to[i].amphur_name_eng}
          obj.push({province_id:Amphures_from[i].province_id,value:Amphures_to[i].value+" /"+Amphures_to[i].amphur_name_eng});
      }
    }
    return obj
  }

  const selected_District_to =(e)=>{
    console.log(e)
    var id =0
    var i=0
    for (i = 0; i < Province_to.length; i++){
      console.log(Province_to[i])
      if (Province_to[i].value == e){
          id = Province_to[i].province_id
      }
    }
    var obj =[]
    var num = Amphures_to.length
    console.log(id)
    for (i = 0; i < num; i++){
      if (Amphures_to[i].province_id == id){
        var data = {province_id:Amphures_from[i].province_id,value:Amphures_to[i].value+" /"+Amphures_to[i].amphur_name_eng}
        obj.push({province_id:Amphures_from[i].province_id,value:Amphures_to[i].value+" /"+Amphures_to[i].amphur_name_eng});      
      }
    }
    console.log(obj)
    return obj
  }


  const handletype = (type) => {
  if (type === null) {
    setmes("กำลังกลับสู่หน้าแรก....")
    setload(true)
    setTimeout(() => {
        setload(false)
        form.resetFields();
        setCurrent(0)
        settype(type)
        setIsModalVisible(true)
        setnametype('')
      }, 100);
    } else {
      settype(type)
      if (type === 1) {
        setnametype('เดินทางโดยเครื่องบิน')
      } else if (type === 2) {
        setnametype('เดินทางโดยรถไฟ')
      } else if (type === 3) {
        setnametype('เดินทางด้วยรถสารสาธารณะ')
      } else if (type === 4) {
        setnametype('เดินทางโดยรถส่วนตัว')
      }
  }

  }

  const steps = [
    {
      title: <Text className='bold' style={{ fontSize: '1.8vh' }}>ประวัติทั่วไป</Text>,
      content:
        <>
          <Form form={form}
            layout="vertical"
            style={{ textAlign: 'left' }}
          >
            <Text type='primary' className='bold'>ท่าน{nametype} กรุณากรอกข้อมูล</Text><br /><br />
            {type !== 1 ? <>
            <Radio.Group onChange={(e)=>setvalue(e.target.value)} value={value}>
              <Radio style={radioStyle} value={0}>
                <Text className='bold'>เลขบัตรประชาชน/ Citizen number</Text>
              </Radio>
              <Radio style={radioStyle} value={1}>
                <Text className='bold'>หนังสือเดินทาง/ Passport number</Text>
              </Radio>
            </Radio.Group>
            <br/><br/>
            {value === 0 ?            
            <Form.Item label={<Text className='bold'>เลขบัตรประชาชน/ Citizen number</Text>}  name="citizen" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณากรอกข้อมูลให้ถูกต้อง</Text> }]}>
              <Input className='bold' placeholder='กรุณากรอกเลขบัตรประชาชน / Citizen number' maxLength={13} />
            </Form.Item> : null}
            {value === 1 ?            
            <Form.Item label={<Text className='bold'>หนังสือเดินทาง/ Passport number</Text>} name="passport" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณากรอกข้อมูลให้ถูกต้อง</Text> }]}>
              <Input className='bold' placeholder='กรุณากรอกหนังสือเดินทาง / Passport number' maxLength={13} />
            </Form.Item> : null}
            </>
            :
            null
            }
            <Form.Item label={<Text className='bold'>ชื่อ / Firstname</Text>} name="Firstname" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณากรอกข้อมูลให้ถูกต้อง</Text> }]}>
              <Input className='bold' placeholder="กรุณากรอกชื่อ / Firstname" />
            </Form.Item>

            {type !== 1 ? <>
            <Form.Item label={<Text className='bold'>นามสกุล / Lastname</Text>} name="Lastname" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณากรอกข้อมูลให้ถูกต้อง</Text> }]}>
              <Input className='bold' placeholder='กรุณากรอกนามสกุล / Lastname' />
            </Form.Item>
            </>
            :
            null
            }

            <Form.Item label={<Text className='bold'>เบอร์โทร / Phone number</Text>} name='tel' rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณากรอกข้อมูลให้ถูกต้อง</Text> }]}>
              <Input type='tel' pattern="[0-9]*" maxLength={10} className='bold' placeholder='กรุณากรอกเบอร์โทร / Phone number'  />
            </Form.Item>
          </Form>

        </>,
    },
    {
      title: <Text className='bold' style={{ fontSize: '1.8vh' }}>ประวัติการเดินทาง</Text>,
      content:
        <>
          <Form
            form={form}
            layout="vertical"
            className='bold'
            style={{ textAlign: 'left' }}
          >
            <div>
              <br /><br />
              <Text className='bold'>ท่านเดินทางมาจากที่ใด</Text>
            </div>
              <Form className='bold' form={form}>
                <Form.Item label={<Text >จังหวัด / Province </Text>} name="provincefrom" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณาเลือกข้อมูล</Text> }]}>
                  <AutoComplete
                    onSelect= {(e)=>setselect_District_from(selected_District_from(e))}
                    options={Province_from}
                    placeholder={<Text className='bold'>กรุณาป้อนจังหวัด <DownOutlined /></Text>}
                    filterOption={(inputValue, option) =>
                      option.value.indexOf(inputValue) !== -1
                    }
                  />
                </Form.Item>
                <Form.Item label={<Text >อำเภอ / Districts </Text>}  name="districtsfrom" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณาเลือกข้อมูล</Text> }]}>
                  <AutoComplete
                    options={select_District_from}
                    placeholder={<Text className='bold'>กรุณาป้อนอำเภอ <DownOutlined /></Text>}
                    filterOption={(inputValue, option) =>
                      option.value.indexOf(inputValue) !== -1
                    }
                  >
                  </AutoComplete>
                </Form.Item>
              </Form>
          </Form>
          <Form
            form={form}
            layout="vertical"
            className='bold'
            style={{ textAlign: 'left' }}
          >
            <div>
              <br /><br />
              <Text className='bold'>ท่านกำลังจะเดินทางไปที่ใด</Text>
            </div>
              <Form className='bold' form={form}>
                <Form.Item label={<Text >จังหวัด / Province </Text>} name="provinceto" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณาเลือกข้อมูล</Text> }]}>
                  <AutoComplete
                    onSelect= {(e)=>setselect_District_to(selected_District_to(e))}
                    options={Province_to}
                    placeholder={<Text className='bold'>กรุณาป้อนจังหวัด <DownOutlined /></Text>}
                    filterOption={(inputValue, option) =>
                      option.value.indexOf(inputValue) !== -1
                    }
                  />
                </Form.Item>
                <Form.Item label={<Text >อำเภอ / Districts </Text>} name="districtsto" rules={[{ required: true, message: <Text className='bold' style={{ fontSize: '10px', color: 'red' }}>กรุณาเลือกข้อมูล</Text> }]}>
                  <AutoComplete
                    options={select_District_to}
                    placeholder={<Text className='bold'>กรุณาป้อนอำเภอ <DownOutlined /></Text>}
                    filterOption={(inputValue, option) =>
                      option.value.indexOf(inputValue) !== -1
                    }
                  />
                </Form.Item>
              </Form>
          </Form>
        </>,
    },
    {
      title: <Text className='bold' style={{ fontSize: '1.8vh' }}>สรุปข้อมูล</Text>,
      content:
        <div style={{ textAlign: 'left' }} className='bold'>

          <Divider style={{ textAlign: 'left' }}><Title level={5}>ประวัติทั่วไป</Title></Divider>
          <Text className='bold'>ท่าน{nametype}</Text><br />
          {value === 1 && type !== 1  ? 
          <Text className='bold'>หนังสือเดินทาง/ Passport number : {form.getFieldValue('passport')}<br /> </Text> 
          :
          null 
          }

          {value === 0 && type !== 1  ? 
          <Text className='bold'>เลขบัตรประชาชน/ Citizen number : {form.getFieldValue('citizen')}<br /> </Text> 
          :
          null
          }
          <Text className='bold'>ชื่อ / Firstname : {form.getFieldValue('Firstname')} </Text> <br />
          {type !== 1 && <><Text className='bold'>นามสกุล / Lastname : {form.getFieldValue('Lastname')} </Text><br/></>}
          <Text className='bold'>เบอร์โทร / Phone number : {form.getFieldValue('tel')} </Text><br />
          <Divider style={{ textAlign: 'left' }}><Title level={5}>ประวัติการเดินทาง</Title></Divider>
          <Text className='bold'>เดินทางมาจาก : </Text><br />
          <Text className='bold'>อำเภอ / District : {form.getFieldValue('districtsfrom')} </Text><br />
          <Text className='bold'>จังหวัด / Province : {form.getFieldValue('provincefrom')} </Text><br />
          <Text className='bold'>กำลังเดินทางไป : </Text><br />
          <Text className='bold'>อำเภอ / District : {form.getFieldValue('districtsto')} </Text><br />
          <Text className='bold'>จังหวัด / Province : {form.getFieldValue('provinceto')} </Text><br />
          <Divider />

        </div>,
    },
  ];

  return (

    <div className="App" >
      <Layout style={{ backgroundColor: 'white' }}>

        <Content>
          <div>
            <Space direction="vertical">
              <Text></Text>
              <img src={LogoSongklha} width="30%"></img>
              <Text type='primary'><Title level={3} className='bold'>แบบฟอร์มเข้าจังหวัดสงขลา</Title></Text>
              <Text><Title level={5} className='bold'>Songkhla Arrivals Form</Title></Text><br />
            </Space>
          </div>

          <Spin size='large' tip={<Text><Title level={5} className='bold'>{mes}</Title></Text>} spinning={load}>
            {type === null ?
              <div>
                <Space direction="vertical" >
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ textAlign: 'center' }}>
                    <Col className="gutter-row" span={24}>
                      <Card hoverable onClick={() => handletype(1)}>
                        <Text><Title level={5} className='bold'>เดินทางโดยเครื่องบิน</Title></Text>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ textAlign: 'center' }}>
                    <Col className="gutter-row" span={24}>
                      <Card hoverable onClick={() => handletype(2)}>
                        <Text><Title level={5} className='bold'>เดินทางโดยรถไฟ</Title></Text>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ textAlign: 'center' }}>
                    <Col className="gutter-row" span={24}>
                      <Card hoverable onClick={() => handletype(3)}>
                        <Text><Title level={5} className='bold'>เดินทางด้วยรถสารสาธารณะ</Title></Text>
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ textAlign: 'center' }}>
                    <Col className="gutter-row" span={24}>
                      <Card hoverable onClick={() => handletype(4)}>
                        <Text><Title level={5} className='bold'>เดินทางโดยรถส่วนตัว</Title></Text>
                      </Card>
                    </Col>
                  </Row>
                </Space>
              </div>
              :
              <>
                <Content style={{ padding: "0% 5vw 0 5vw", marginBottom: '5%' }}>
                  <Row align='middle' style={{ marginBottom: '5%' }}>
                    <Steps current={current} progressDot >
                      {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                      ))}
                    </Steps>
                  </Row>
                  {steps[current].content}
                </Content>
                <Space direction="vertical" >
                  <div className="steps-action">
                    <Button type="dashed" onClick={() => handletype(null)} className='bold' >หน้าแรก</Button>
                  &emsp;
                  {current > 0 && (
                      <Button style={{ margin: '0 8px' }} className='bold' onClick={() => prev()}>
                        ย้อนกลับ
                      </Button>
                    )}
                    {current < steps.length - 1 && (
                      <Button type="primary" htmlType='submit' className='bold' onClick={() => next()} >
                        ถัดไป
                      </Button>

                    )
                    }
                    {current === steps.length - 1 && (

                      <Button type="primary" htmlType='submit' className='bold' onClick={() => send_data()}>
                        ยืนยัน
                      </Button>

                    )}
                  </div>
                  </Space>

                  <Modal visible={isModalVisible} onOk={handleOk} cancelButtonProps={{ style: { display: 'none' } }} closable={false} 
                  style={{marginTop:'-8vh'}}>
                    <Comment
                      author={<a className='bold'>คณะแพทยศาสตร์ มหาวิทยาลัยสงขลานครินทร์</a>}
                      avatar={
                        <Avatar
                          src={LogoHos}
                          alt="Han Solo"
                        />
                      }
                      content={
                        <div>
                          <p className='bold'>เรียน ท่านผู้โดยสารทุกท่าน<br /></p><br />
                          <p className='bold'>ตามประกาศจังหวัดสงขลา ผู้โดยสารที่เดินทางเข้าจังหวัดสงขลาทุกท่านต้องกรอกข้อมูลและแสดง QR Code ในโทรศัพท์แก่เจ้าหน้าที่ จึงจะได้รับอนุญาต
                          
                           
                          {type === 1 ? <>ให้ออกจากสนามบิน</>:null}
                          {type === 2 ? <>ให้ออกจากสถานีรถไฟ</>:null}
                          {type === 3 ? <>ให้ออกจากสถานีรถโดยสารสาธารณะ</>:null}
                          {type === 4 ? <>ให้เข้าจังหวัดสงขลาได้</>:null}
                          
                          <br /><br />
                          Please fill your information and present QR code on your phone to the airport staff upon your arrival to Songkhla. Failure to do so will result in
                          the prohibition 
                          
                          {type === 1 ? <> of leaving the airport and </>:null}
                          {type === 2 ? <> of leaving the train station and </>:null}
                          {type === 3 ? <> of leaving the bus station and </>:null}
                          {type === 4 ? <> of </>:null}
                        
                          entry to Songkhla according to the Songkhla province declaration.</p><br />
                          <p className='bold'> ขออภัยในความไม่สะดวก <br /> จังหวัดสงขลา</p>
                          <br />
                          <p className='bold' style={{ color: 'red' }}>
                            *หากปิดบังจะมีโทษตาม พ.ร.บ. โรคติดต่อ พ.ศ. 2558 มาตรา 34 (1) <br />
                            *Fabrication and/or concealment of your information, a punishment according to Communicable Disease Act B.E.2558 (A.D.2015) Section 34 (1) will be applied.
                            </p>
                        </div>
                      }
                    />
                  </Modal>

                  <Modal
                    closable={false} 
                    style={{ textAlign: 'center',marginTop:'-8vh' }}
                    visible={isModalVisible_comfirm}
                    onOk={()=>close_isModalVisible_comfirm()}
                    cancelButtonProps={{ style: { display: 'none' } }}>
                    <div>
                    <CheckOutlined twoToneColor="#73d13d" style={{ fontSize: '10vw', color: '#73d13d' }} /><br />
                    <Text className='bold' style={{ fontSize: '1.8vh' }}>ส่งข้อมูลสำเร็จ</Text><br/>
                    {/* {props.zone.zone_active === "0" && <Text className='bold' style={{ fontSize: '3vh',color:'#73d13d' }}>กรุณาเดินเข้าช่องทางหมายเลข 1</Text>}
                    {props.zone.zone_active !== "0" && <Text className='bold' style={{ fontSize: '3vh',color:'#73d13d' }}>กรุณาเดินเข้าช่องทางหมายเลข 2</Text>} */}
                    </div>
                    <QRCode
                      id='qrcode'
                      value={encode}
                      size={290}
                      level={"H"}
                      includeMargin={true}
                    />
                    <div>
                    <Text className='bold' style={{ fontSize: '1.8vh' }}>{moment().format("DD/MM/YY , HH:mm:ss")}</Text>
                    <br/>
                    <Button className='bold' onClick={downloadQR} style={{ fontSize: '1.8vh' }}>Download QRCode </Button>
                    </div>
                  </Modal>
                  <Modal
                    closable={false} 
                    style={{ textAlign: 'center',marginTop:'-8vh' }}
                    visible={isModalVisible_error}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}>
                    <CloseOutlined twoToneColor="#ff4d4f" style={{ fontSize: '10vw', color: '#ff4d4f' }} /><br />
                    <Text className='bold' style={{ fontSize: '1.8vh' }}>ส่งข้อมูลไม่สำเร็จ</Text>
                  </Modal>
              </>
            }
          </Spin>

        </Content>

        <Footer style={{ textAlign: 'center', marginTop: '5%',backgroundColor:'white' }}>
          <Divider></Divider>
          <img src={LogoDR} width="100vh"></img>
          &emsp;
          <img src={LogoHos} width="60vh"></img>
          &emsp;
          <img src={Logoaot} width="80vh"></img>
          &emsp;
          <img src={Logodlt} width="55vh"></img>
          &emsp;
          <img src={Logotrain} width="65vh"></img>
          <img src={Logodc} width="60vh"></img>
          &emsp;
          <img src={Logoppho} width="55vh"></img>
          &emsp;
          <img src={Logodrii} width="200vh"></img>
          <Divider></Divider>
          <Text className='regular' style={{color:'gray'}}>Version 1.1 </Text><br />

        </Footer>
      </Layout>
    </div>

  )
};


// map state with redux
const mapStateToProps = function(state) {
  return {
    zone: state.Zone,
  }
}
// export default App;

// map translate en/th
// App.propTypes = {
//   t: PropTypes.func.isRequired,
// };

const AppWithConnect = connect(mapStateToProps)(App)

export default AppWithConnect;
