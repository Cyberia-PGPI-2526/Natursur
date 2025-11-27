import { useEffect, useState } from "react"
import Toast from "../../components/Toast"
import { getOrders, updateOrderStatus } from "../../service/orders.service"

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const loadData = async (pageToLoad = page) => {
    setIsLoading(true)
    try {
      const res = await getOrders(pageToLoad, limit)
      console.log(res)
      setOrders(res.orders || [])
      setTotalPages(res.totalPages || 1)
      setPage(res.page || pageToLoad)
    } catch (e) {
      setToast({ message: "Error cargando órdenes", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(1)
  }, [])

  const prevPage = () => {
    if (page <= 1) return
    loadData(page - 1)
  }

  const nextPage = () => {
    if (page >= totalPages) return
    loadData(page + 1)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-[#009BA6]">Cargando órdenes...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#009BA6]">Órdenes</h1>
          <p className="text-gray-600 mt-2">Gestiona las órdenes de los clientes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                setIsLoading(true)
                // try to fetch many orders (adjust limit as needed)
                const res = await getOrders(1, 1000)
                const ordersToExport = res.orders || []

                // build CSV
                const headers = ["Order ID","Fecha","Cliente","Productos","Cantidad","Status"]
                const rows = []
                for (const o of ordersToExport) {
                  // products as "name (qty); name2 (qty)"
                  const prodStr = o.orderProducts.map(p => `${p.product.name} (${p.quantity})`).join(' ; ')
                  rows.push([o.id, new Date(o.order_date).toLocaleString('es-ES'), o.user?.email || '', prodStr, '', o.status || ''])
                }

                const csvLines = [headers.join(',')]
                for (const r of rows) {
                  // escape double quotes
                  const escaped = r.map(cell => `"${String(cell).replace(/"/g, '""')}"`)
                  csvLines.push(escaped.join(','))
                }

                const csvContent = "\uFEFF" + csvLines.join('\n') // BOM for Excel
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `orders_export_${new Date().toISOString().slice(0,10)}.csv`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)

                setToast({ message: 'Exportación iniciada (CSV)', type: 'success' })
              } catch (err) {
                console.error(err)
                setToast({ message: 'Error exportando órdenes', type: 'error' })
              } finally {
                setIsLoading(false)
              }
            }}
            className="px-4 py-2 bg-white border border-[#009BA6] text-[#009BA6] rounded-lg hover:bg-[#f0fbfb] transition font-semibold"
          >
            Exportar Excel (CSV)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#009BA6] text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold">Cliente</th>
                <th className="py-4 px-6 text-left font-semibold">Fecha</th>
                <th className="py-4 px-6 text-left font-semibold">Productos</th>
                <th className="py-4 px-6 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 && (
                <tr>
                  <td
                    className="py-6 px-6 text-center text-gray-600"
                    colSpan="4"
                  >
                    No hay órdenes registradas.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-700">{order.user?.email}</td>
                  <td className="py-4 px-6 text-gray-700">{formatDate(order.order_date)}</td>
                  <td className="py-4 px-6">
                    <ul className="space-y-1">
                      {order.orderProducts.map((op) => (
                        <li key={op.id} className="flex justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-gray-700">{op.product.name}</span>
                          <span className="text-gray-500">Cantidad: {op.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const res = await updateOrderStatus(order.id, 'READY')
                          if (res?.error) {
                            setToast({ message: res.error || 'Error actualizando estado', type: 'error' })
                          } else {
                            setToast({ message: 'Pedido marcado como listo', type: 'success' })
                            setOrders((prev) => prev.map(o => o.id === order.id ? { ...o, status: 'READY' } : o))
                          }
                        }}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        disabled={order.status === 'READY'}
                      >
                        {order.status === 'READY' ? 'Listo' : 'Marcar listo'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          className="px-6 py-3 bg-[#009BA6] text-white rounded-lg hover:bg-[#007a82] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={prevPage}
          disabled={page <= 1}
        >
          ← Anterior
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          className="px-6 py-3 bg-[#009BA6] text-white rounded-lg hover:bg-[#007a82] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={nextPage}
          disabled={page >= totalPages}
        >
          Siguiente →
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
