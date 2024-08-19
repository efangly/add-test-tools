import { Button, Card, ListGroup } from "react-bootstrap";
import { FaListUl, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";
import { socket } from "../../utils/socket";
import './style.css';
import Swal from "sweetalert2";

interface Orders {
  OrderId: string,
  PrescriptionNo: string,
  OrderitemCode: string,
  OrderitemName: string,
  OrderQty: number,
  OrderunitCode: string,
  Machine: string,
  Command: string,
  BinLocation: string,
  OrderStatus: string,
  RowID: string,
  Slot: string,
  CreatedAt: Date,
  UpdatedAt: Date
}

interface Queue<T> {
  PrescriptionNo: string,
  PrescriptionDate: string,
  Hn: string,
  An: string,
  PatientName: string,
  WardCode: string,
  WardDesc: string,
  PriorityCode: string,
  PriorityDesc: string,
  PresStatus: string,
  CreatedAt: Date,
  UpdatedAt: Date,
  Order: T[]
}

interface StatusData {
  status: number,
  data: Queue<Orders>
}

const QueueList = () => {
  const [data, setData] = useState<string>('');
  const [list, setList] = useState<Orders[]>([]);
  const fetchData = () => {
    axios.get<StatusData>(`${import.meta.env.VITE_API_URL}/order`)
      .then((response) => {
        setList(!!response.data.data ? response.data.data.Order : []);
      }).catch((err) => {
        console.log(err);
      })
  }

  const cancelOrder = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/order/0`)
      .then((_response) => {
        fetchData();
        Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        }).fire({ icon: 'error', title: 'ยกเลิกรายการเรียบร้อย' });
      }).catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    fetchData();
    socket.on('res_message', (receivedata) => {
      setData(receivedata);
    });
    socket.on('machine_message', (receivedata) => {
      setData(receivedata);
    });
    socket.on('connect', () => console.log('Socket is connected!!'))
    socket.on('disconnect', () => console.log('Socket is disconnected!!'))
    return () => { socket.off('res_message') };
  }, [data]);

  return (
    <Card className="my-2 mx-2">
      <Card.Header className="d-flex justify-content-between">
        <Card.Title className="d-flex align-items-center"><FaListUl className="me-2" size={26} /> Task List</Card.Title>
        <Button className="btn cancel-order px-4" onClick={cancelOrder}><FaTrash /> ลบรายการ</Button>
      </Card.Header>
      <Card.Body className="p-2 queue-card">
        <ListGroup variant="flush">
          {list.length === 0 ? <h1 className="text-center lh-lg">ไม่มีรายการในคิว</h1> : list.map((item, index) => (
            <ListGroup.Item
              key={index}
              className={`d-flex justify-content-between span-queue ${item.OrderStatus === '1' ? 'item-active' : item.OrderStatus === '2' ? 'item-success' : item.OrderStatus === '3' ? 'item-fail' : ''}`} >
              <span>{item.OrderitemName} จำนวน {item.OrderQty} รายการ [ชั้น {item.BinLocation.substring(0, 1)} ช่องที่ {item.BinLocation.substring(1, 3)}]</span>
              <span>{item.OrderStatus === "0" ? 'รอคิวจัดยา' : item.OrderStatus === "1" ? 'กำลังจัดยา' : item.OrderStatus === "2" ? 'จัดยาเรียบร้อย' : 'จัดยาไม่สำเร็จ'}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default QueueList;