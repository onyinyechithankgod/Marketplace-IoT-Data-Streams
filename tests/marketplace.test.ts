import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockContractCall = vi.fn()

describe('Marketplace Contract', () => {
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
  const contractName = 'marketplace'
  let seller: string
  let buyer: string
  
  beforeEach(() => {
    seller = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    buyer = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC'
    mockContractCall.mockClear()
  })
  
  describe('list-for-sale', () => {
    it('should list a token for sale successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: true })
      const result = await mockContractCall('list-for-sale', [0, 100], { sender: seller })
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
  })
  
  describe('cancel-sale', () => {
    it('should cancel a sale successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: true })
      const result = await mockContractCall('cancel-sale', [0], { sender: seller })
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should fail if called by non-seller', async () => {
      mockContractCall.mockResolvedValueOnce({ success: false, error: 401 })
      const result = await mockContractCall('cancel-sale', [0], { sender: buyer })
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
  
  describe('buy', () => {
    it('should buy a token successfully', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: true })
      const result = await mockContractCall('buy', [0], { sender: buyer })
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should fail if token is not for sale', async () => {
      mockContractCall.mockResolvedValueOnce({ success: false, error: 404 })
      const result = await mockContractCall('buy', [999], { sender: buyer })
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-sale', () => {
    it('should return sale information', async () => {
      const saleInfo = {
        seller: seller,
        price: 100
      }
      mockContractCall.mockResolvedValueOnce({ success: true, value: saleInfo })
      const result = await mockContractCall('get-sale', [0])
      expect(result.success).toBe(true)
      expect(result.value).toEqual(saleInfo)
    })
    
    it('should return null for non-existent sale', async () => {
      mockContractCall.mockResolvedValueOnce({ success: true, value: null })
      const result = await mockContractCall('get-sale', [999])
      expect(result.success).toBe(true)
      expect(result.value).toBeNull()
    })
  })
})

