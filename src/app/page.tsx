import { db } from '@/lib/db'
import Button from '@/components/ui/Button'
export default  async function Home() {
  // await db.set('hello','hello')


  return (
    <div className='text-red-500'>
      <Button variant='ghost'>Hello</Button>
    </div>
   
  )
}
