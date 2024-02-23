import React from 'react'

export const AssetManagerProfilesCell = (props: any) => {
  const { item, assetManagers } = props
  const mainAccount = item?.account_info?.[0]
  const [managerProfile, setManagerProfile] = React.useState<any[]>([])

  React.useEffect(() => {
    let finalArr = []
    if (assetManagers && assetManagers?.length > 0) {
      if (mainAccount?.asset_manager_id?.length === 1) {
        finalArr = assetManagers.filter((asset: any) => asset.employee_id === mainAccount.asset_manager_id[0])
      } else if (mainAccount?.asset_manager_id?.length === 2) {
        const firstAM = assetManagers.find((asset: any) => mainAccount.asset_manager_id[0] === asset.employee_id)
        const secondAM = assetManagers.find((asset: any) => mainAccount.asset_manager_id[1] === asset.employee_id)
        // sequence is given by item.asset_manager_id not assetManagers
        if (firstAM) finalArr.push(firstAM)
        if (secondAM) finalArr.push(secondAM)
      }
    }
    setManagerProfile(finalArr)
  }, [assetManagers, mainAccount?.asset_manager_id])

  return (
    <td className="p-2 text-right pl-4">
      <div className="flex relative ">
        <div className="flex items-center justify-end">
          {managerProfile &&
            managerProfile.length > 0 && 
            managerProfile.map((profile, index) => (
              <img
                className={`w-6 h-6 rounded-full ${index === 1 ? 'absolute z-0 left-2' : 'z-10 absolute left-0'}`}
                src={profile.profile_picture_url}
                key={index}
                alt="Profile"
              />
            ))}
        </div>
      </div>
    </td>
  )
}
