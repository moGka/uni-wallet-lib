import { 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  type UseWriteContractReturnType, 
  type UseWaitForTransactionReceiptReturnType 
} from 'wagmi'
import type { Address, Abi, Hash } from 'viem'

interface UseContractWriteProps {
  address: Address,
  abi: Abi,
  functionName: string,
  args: unknown[],
  value?: bigint,
  chainId?: number,
  enabled?: boolean,
  gasLimit?: bigint
}

type UseContractWriteReturn = 
Omit<UseWriteContractReturnType, 'writeContract' | 'writeContractAsync'> & 
{
  receipt: UseWaitForTransactionReceiptReturnType,
  write: (overrideArgs?: unknown[]) => void,
  writeAsync: (overrideArgs?: unknown[]) => Promise<Hash | undefined>,
}

export function useContractWrite({
  address,
  abi,
  functionName,
  args,
  value,
  chainId,
  enabled = true,
  gasLimit
}: UseContractWriteProps): UseContractWriteReturn {

  const {
    writeContract,
    writeContractAsync,
    ...returnTypes
  } = useWriteContract()

  const receipt = useWaitForTransactionReceipt({
    hash: returnTypes.data
  })

  const write = (overrideArgs?: unknown[]) => {
    if (!enabled) return
    writeContract({
      address,
      abi,
      functionName,
      args: overrideArgs || args,
      value,
      chainId,
      gas: gasLimit
    })
  }

  const writeAsync = async (overrideArgs?: unknown[]) => {
    if (!enabled) return
    return await writeContractAsync({
      address,
      abi,
      functionName,
      args: overrideArgs || args,
      value,
      chainId,
      gas: gasLimit
    })
  }

  return {
    write,
    writeAsync,
    receipt,
    ...returnTypes,
  }
}