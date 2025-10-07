import { useCourseContract } from 'uni-wallet-lib'
import { useState } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

const CourseContractDemo = () => {
  const { address: userAddress } = useAccount()
  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [instructorAddress, setInstructorAddress] = useState<Address>()
  const [courseIdToPurchase, setCourseIdToPurchase] = useState('')
  const [courseIdToView, setCourseIdToView] = useState('')
  const [studentAddressToCheck, setStudentAddressToCheck] = useState<Address>()

  const {
    createCourseReceipt,
    purchaseCourseReceipt,
    hasAccess,
    getCourse,
    getStudentCourses,
    getInstructorCourses,
    getTotalCourses,
    getCourseStudentCount,
    createCourse,
    purchaseCourse,
  } = useCourseContract({
    address: '0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d' as Address,
    tokenDecimals: 18,
  })

  // 读取数据
  const totalCourses = getTotalCourses()
  const courseToView = getCourse(courseIdToView ? BigInt(courseIdToView) : undefined)
  const studentCourses = getStudentCourses(studentAddressToCheck || userAddress || '0x0' as Address)
  const instructorCourses = getInstructorCourses(instructorAddress || userAddress || '0x0' as Address)
  const accessCheck = hasAccess(
    studentAddressToCheck || userAddress,
    courseIdToView ? BigInt(courseIdToView) : undefined
  )
  const courseStudentCount = getCourseStudentCount(
    courseIdToView ? BigInt(courseIdToView) : 0n
  )

  const handleCreateCourse = async () => {
    if (!courseTitle || !coursePrice || !instructorAddress) {
      alert('请填写完整的课程信息')
      return
    }
    try {
      await createCourse(courseTitle, instructorAddress, coursePrice)
      alert('课程创建交易已提交，等待确认...')
      setTimeout(() => {
        totalCourses.refetch()
      }, 3000)
    } catch (error: any) {
      alert(`创建课程失败: ${error.message}`)
    }
  }

  const handlePurchaseCourse = async () => {
    if (!courseIdToPurchase) {
      alert('请输入课程ID')
      return
    }
    try {
      await purchaseCourse(BigInt(courseIdToPurchase))
      alert('购买课程交易已提交，等待确认...')
      setTimeout(() => {
        studentCourses.refetch()
      }, 3000)
    } catch (error: any) {
      alert(`购买课程失败: ${error.message}`)
    }
  }

  const formatPrice = (value: bigint | undefined) => {
    if (!value) return '0'
    return (Number(value) / 1e18).toFixed(2)
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '32px',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        📚 Course Contract Demo
      </h1>

      {!userAddress && (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '16px',
          padding: '32px'
        }}>
          <p>👆 请先连接钱包</p>
        </div>
      )}

      {userAddress && (
        <>
          {/* 合约统计信息 */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              📊 合约统计
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              <InfoRow
                label="课程总数"
                value={totalCourses.data ? totalCourses.data.toString() : '加载中...'}
              />
            </div>
          </div>

          {/* 创建课程 */}
          <div style={{
            background: '#f0fdf4',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              ✏️ 创建课程
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  课程标题:
                </label>
                <input
                  type="text"
                  placeholder="Web3 开发入门"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  讲师地址:
                </label>
                <input
                  type="text"
                  placeholder={userAddress}
                  value={instructorAddress}
                  onChange={(e) => setInstructorAddress(e.target.value as Address)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  课程价格 (YD):
                </label>
                <input
                  type="text"
                  placeholder="100"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                onClick={handleCreateCourse}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {createCourseReceipt.isLoading ? '⏳ 创建中...' : '✏️ 创建课程'}
              </button>

              {createCourseReceipt.isSuccess && (
                <div style={{ color: '#10b981', fontSize: '14px' }}>
                  ✅ 课程创建成功! 交易哈希: {createCourseReceipt.data?.transactionHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>

          {/* 购买课程 */}
          <div style={{
            background: '#fef3c7',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              🛒 购买课程
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  课程ID:
                </label>
                <input
                  type="text"
                  placeholder="1"
                  value={courseIdToPurchase}
                  onChange={(e) => setCourseIdToPurchase(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                onClick={handlePurchaseCourse}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {purchaseCourseReceipt.isLoading ? '⏳ 购买中...' : '🛒 购买课程'}
              </button>

              {purchaseCourseReceipt.isSuccess && (
                <div style={{ color: '#f59e0b', fontSize: '14px' }}>
                  ✅ 课程购买成功! 交易哈希: {purchaseCourseReceipt.data?.transactionHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>

          {/* 查询课程信息 */}
          <div style={{
            background: '#eff6ff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              🔍 查询课程
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  课程ID:
                </label>
                <input
                  type="text"
                  placeholder="1"
                  value={courseIdToView}
                  onChange={(e) => setCourseIdToView(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {courseToView.data && courseIdToView && (
                <div style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <InfoRow label="课程ID" value={courseToView.data.id.toString()} />
                  <InfoRow label="课程标题" value={courseToView.data.title} />
                  <InfoRow
                    label="讲师"
                    value={`${courseToView.data.instructor.slice(0, 6)}...${courseToView.data.instructor.slice(-4)}`}
                  />
                  <InfoRow label="价格" value={`${formatPrice(courseToView.data.price)} YD`} />
                  <InfoRow label="已发布" value={courseToView.data.isPublished ? '✅ 是' : '❌ 否'} />
                  <InfoRow
                    label="学生数"
                    value={courseStudentCount.data ? courseStudentCount.data.toString() : '0'}
                  />
                  <InfoRow
                    label="我的访问权限"
                    value={accessCheck.data ? '✅ 已购买' : '❌ 未购买'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 我的课程 */}
          <div style={{
            background: '#faf5ff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              🎓 我购买的课程
            </h2>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                学生地址 (默认当前用户):
              </label>
              <input
                type="text"
                placeholder={userAddress}
                value={studentAddressToCheck}
                onChange={(e) => setStudentAddressToCheck(e.target.value as Address)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  marginBottom: '16px'
                }}
              />

              {studentCourses.data && studentCourses.data.length > 0 ? (
                <div style={{ color: '#111827' }}>
                  课程ID列表: {studentCourses.data.map(id => id.toString()).join(', ')}
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>暂无购买记录</div>
              )}
            </div>
          </div>

          {/* 我创建的课程 */}
          <div style={{
            background: '#fef2f2',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{
              color: '#374151',
              marginBottom: '16px',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              👨‍🏫 我创建的课程
            </h2>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                讲师地址 (默认当前用户):
              </label>
              <input
                type="text"
                placeholder={userAddress}
                value={instructorAddress}
                onChange={(e) => setInstructorAddress(e.target.value as Address)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  marginBottom: '16px'
                }}
              />

              {instructorCourses.data && instructorCourses.data.length > 0 ? (
                <div style={{ color: '#111827' }}>
                  课程ID列表: {instructorCourses.data.map(id => id.toString()).join(', ')}
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>暂无创建记录</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// 信息行组件
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb'
  }}>
    <span style={{ fontWeight: '500', color: '#6b7280' }}>{label}:</span>
    <span style={{ color: '#111827', fontWeight: '600' }}>{value}</span>
  </div>
)

export default CourseContractDemo
