'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import { formatTime, parseTimeToSeconds, shortenTxnHash } from '@/lib/utils'
import { ArrowRight, Bell, Box, Code, Layout, MessageSquare } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

const PRIVACY_LINKS = [
  { text: 'Ever heard of GDPR?', url: 'https://gdpr-info.eu/' },
  {
    text: 'Constitutional rights for privacy',
    url: 'https://fra.europa.eu/en/law-reference/european-convention-human-rights-article-8-0',
  },
  {
    text: 'Request for Information Act',
    url: 'https://www.justice.gov/oip/freedom-information-act-5-usc-552',
  },
  { text: 'Aztec Merch Store', url: 'https://store.aztec.network/' },
]

const RICK_ROLL_WORDS = [
  'Never',
  'gonna',
  'give',
  'you',
  'up',
  'never',
  'gonna',
  'let',
  'you',
  'down',
]

const INITIAL_TRANSACTION_DATA = [
  {
    txnHash: '0x0838f46715219fc857bd5da73170ab1e9e869850a0f7578e7565c6eb8017973d',
    txnStatus: 'Paid',
    txnType: 'INVOKE_FUNCTION',
    age: '12s ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da731708jy88s869850a0f7578e7565c6eb801797cd',
    txnStatus: 'Pending',
    txnType: 'INVOKE_FUNCTION',
    age: '24s ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da731708jh7js869850a0f7578e7565c6eb8017979kj',
    txnStatus: 'Unpaid',
    txnType: 'INVOKE_FUNCTION',
    age: '36s ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da731708jhuujj69850a0f7578e7565c6eb801797ik',
    txnStatus: 'Paid',
    txnType: 'INVOKE_FUNCTION',
    age: '48s ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da73170ssss8s869850a0f7578e7565c6eb801794df',
    txnStatus: 'Paid',
    txnType: 'INVOKE_FUNCTION',
    age: '1m ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da731708jsdjs869850a0f7578e7565c6eb8017972s',
    txnStatus: 'Pending',
    txnType: 'INVOKE_FUNCTION',
    age: '1m ago',
  },
  {
    txnHash: '0x0838f46715219fc857bd5da731708jh7js8698508hfr6h78e765c6eb801797xs',
    txnStatus: 'Unpaid',
    txnType: 'INVOKE_FUNCTION',
    age: '1m ago',
  },
]

const DASHBOARD_DATA = [
  {
    id: '1',
    heading: 'Blocks',
    value: '1,284,180',
    icon: (
      <Box
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
  {
    id: '2',
    heading: 'Transactions',
    value: '164,543,068',
    icon: (
      <ArrowRight
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
  {
    id: '3',
    heading: 'Contracts',
    value: '5,465,761',
    icon: (
      <Code
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
  {
    id: '4',
    heading: 'Events',
    value: '924,266,759',
    icon: (
      <Bell
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
  {
    id: '5',
    heading: 'Messages',
    value: '2,095,024',
    icon: (
      <MessageSquare
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
  {
    id: '6',
    heading: 'Classes',
    value: '65,705',
    icon: (
      <Layout
        size={24}
        className="text-pink-500"
      />
    ),
    color: 'text-pink-500',
  },
]

type Transaction = { hash: string; revealed: boolean }

const generateRandomTxnHash = (): string => {
  let result = '0x'
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz'
  const length = 64

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const generateRandomHashes = (count: number): Transaction[] => {
  const hashes = [{ hash: '', revealed: false }]
  for (let i = 0; i < count; i++) {
    hashes.push({
      hash: generateRandomTxnHash(),
      revealed: false,
    })
  }
  console.log('HASHES', hashes)
  return hashes
}

const getRandomStatus = () => {
  const statuses = ['Paid', 'Pending', 'Unpaid']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

const getRandomTxnType = () => {
  const types = ['INVOKE_FUNCTION', 'DEPLOY', 'TRANSFER', 'APPROVE', 'SWAP']
  return types[Math.floor(Math.random() * types.length)]
}

export default function Home() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTION_DATA)
  const [transactionCount, setTransactionCount] = useState(
    parseInt(DASHBOARD_DATA[1].value.replace(/,/g, ''))
  )
  const [counter, setCounter] = useState(0)

  const [selectedMessage, setSelectedMessage] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [transactionHashes, setTransactionHashes] = useState<Transaction[]>([])
  const router = useRouter()

  useEffect(() => {
    const getRandomInterval = () => Math.floor(Math.random() * (30000 - 15000 + 1)) + 15000

    const addNewTransaction = () => {
      const newTransaction = {
        txnHash: generateRandomTxnHash(),
        txnStatus: getRandomStatus(),
        txnType: getRandomTxnType(),
        age: '0s ago',
      }

      setTransactions((prevTransactions) => {
        const updatedTransactions = [newTransaction, ...prevTransactions]
        return updatedTransactions.slice(0, 7)
      })

      setTransactionCount((prevCount) => prevCount + 1)
      setCounter((prevCounter) => prevCounter + 1)
      setTimeout(addNewTransaction, getRandomInterval())
    }

    const initialTimeout = setTimeout(addNewTransaction, getRandomInterval())

    const ageInterval = setInterval(() => {
      setTransactions((prevTransactions) =>
        prevTransactions.map((txn) => {
          const currentAgeInSeconds = parseTimeToSeconds(txn.age)
          const newAgeInSeconds = isNaN(currentAgeInSeconds) ? 1 : currentAgeInSeconds + 1
          return {
            ...txn,
            age: formatTime(newAgeInSeconds),
          }
        })
      )
    }, 1000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(ageInterval)
    }
  }, [])

  const formattedTransactionCount = transactionCount.toLocaleString()

  const updatedDashboardData = DASHBOARD_DATA.map((item) => {
    if (item.id === '2') {
      return { ...item, value: formattedTransactionCount }
    }
    return item
  })

  const handleRevealClick = () => {
    const choice = Math.floor(Math.random() * 3)

    if (choice === 0) {
      router.push('/txn-detail')
    } else if (choice === 1) {
      const randomIndex = Math.floor(Math.random() * PRIVACY_LINKS.length)
      window.open(PRIVACY_LINKS[randomIndex].url, '_blank')
    } else {
      const randomHashes = generateRandomHashes(6)
      setTransactionHashes(randomHashes)
      setIsDialogOpen(true)
    }
  }

  const revealHash = (index: number) => {
    setTransactionHashes((prevHashes) =>
      prevHashes.map((hash, i) => (i === index ? { ...hash, revealed: true } : hash))
    )
  }

  return (
    <main className="pt-20 flex flex-col gap-20">
      <section>
        <div className="grid grid-cols-3 gap-3">
          {updatedDashboardData.map((data) => {
            return (
              <Card key={data.id}>
                <div className="flex items-center px-6">
                  <div>{data.icon}</div>
                  <CardHeader>
                    <CardTitle>{data.heading}</CardTitle>
                    <CardDescription className="text-2xl">{data.value}</CardDescription>
                  </CardHeader>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-primary font-bold mb-4">Latest Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Transaction Hash</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Age</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow
                key={txn.txnHash}
                className={
                  counter > 0 && txn === transactions[0] ? 'bg-primary/20 animate-pulse' : ''
                }
              >
                <TableCell className="font-medium">
                  <span className="text-primary underline hover:no-underline cursor-pointer">
                    {shortenTxnHash(txn.txnHash)}
                  </span>
                </TableCell>
                <TableCell>{txn.txnType}</TableCell>
                <TableCell>{txn.txnStatus}</TableCell>
                <TableCell>{txn.age}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={handleRevealClick}
                  >
                    Reveal
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Dialog
        open={isDialogOpen && !!selectedMessage}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false)
            setSelectedMessage('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Information</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-lg font-semibold text-primary">{selectedMessage}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogOpen && transactionHashes.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false)
            setTransactionHashes([])
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Hashes</DialogTitle>
          </DialogHeader>
          <div className="grid">
            {transactionHashes.map((hash, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-primary/30 p-3"
              >
                <code className="font-mono text-xs md:text-sm overflow-hidden text-ellipsis">
                  {hash.revealed
                    ? RICK_ROLL_WORDS[index % RICK_ROLL_WORDS.length]
                    : shortenTxnHash(hash.hash)}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revealHash(index)}
                  disabled={hash.revealed}
                >
                  {hash.revealed ? 'Revealed' : 'Reveal'}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
