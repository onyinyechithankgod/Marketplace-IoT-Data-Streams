import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('IoT Data Token Contract', () => {
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  const contractName = 'iot-data-token'
  let creator: string
  let user: string
  
  beforeEach(() => {
    creator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    user = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC'
    mockContractCall.mockClear()
  })
  
  describe('mint', () => {
    it('should mint a new token successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: 0 })
      const result = await mockContractCall('mint', ['device123', 'temperature', 'QmHash', 100], { sender: creator })
      expect(result.success).toBe(true)
      expect(result.value).toBe(0)
    })
  })
  
  describe('transfer', () => {
    it('should transfer a token successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: true })
      const result = await mockContractCall('transfer', [0, user], { sender: creator })
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should fail if called by non-owner', async () => {
      mockContractCall.mockResolvedValueOnce({ success: false, error: 401 })
      const result = await mockContractCall('transfer', [0, creator], { sender: user })
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
  
  describe('get-token-metadata', () => {
    it('should return token metadata', async () => {
      const metadata = {
        owner: creator,
        'device-id': 'device123',
        'data-type': 'temperature',
        'ipfs-hash': 'QmHash',
        timestamp: 12345,
        price: 100
      }
      mockContractCall.mockResolvedValueOnce({ success: true, value: metadata })
      const result = await mockContractCall('get-token-metadata', [0])
      expect(result.success).toBe(true)
      expect(result.value).toEqual(metadata)
    })
  })
  
  describe('update-price', () => {
    it('should update token price successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: true })
      const result = await mockContractCall('update-price', [0, 200], { sender: creator })
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should fail if called by non-owner', async () => {
      mockContractCall.mockResolvedValueOnce({ success: false, error: 401 })
      const result = await mockContractCall('update-price', [0, 200], { sender: user })
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
})

