import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


const TransactionHistory = () => {
    const recentTransactions = [
        { currency: 'ETH', amount: 0.5, time: '2023-06-15 14:30:00' },
        { currency: 'BTC', amount: 0.025, time: '2023-06-15 12:15:00' },
        { currency: 'USDC', amount: 100, time: '2023-06-14 23:45:00' },
        { currency: 'ETH', amount: 0.75, time: '2023-06-14 18:20:00' },
        { currency: 'BTC', amount: 0.01, time: '2023-06-14 09:10:00' },
      ]
  return (
    <div>
        {/* Recent Transactions Section */}
        <section className="container mx-auto px-4 py-16 bg-white rounded-lg shadow-lg my-16">
        <h2 className="text-3xl font-bold mb-12 text-left text-blue-500 ">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{transaction.currency}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}

export default TransactionHistory