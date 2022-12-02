//  const : FunctionComponent<Props> = () => {
//   return (

//     <>
//     <div
//       className={`menu-hider ${backgroundDimmer ? 'menu-active' : ''}`}
//       onClick={() => {
//         setBackgroundDimmer(false);
//         setProgressReasonModalVisible(false);
//         setSuspendReasonModalVisible(false);
//         setFollowUpModalVisible(false);
//         setImageModalVisible(false);
//         setConfirmModalVisible(false);
//       }}
//     ></div>
//     <div id="page" className="mission-details">
//       {/* <Footer footerMenuVisible={true} activePage={1} /> */}
//       <div className="page-content technician-mission-page">
//         <PrevHeader />
//         {/* <div className="card header-card shape-rounded">
//           <div className="card-overlay bg-highlight opacity-95"></div>
//           <div className="card-overlay dark-mode-tint"></div>
//           <div className="card-bg preload-img" data-src="images/pictures/20s.jpg"></div>
//         </div> */}
//       </div>

//       <div className="container">
//         <div className="card">
//           <div className="technician-mission-page">
//             <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
//               <div className="section-1 w-100">
//                 <div className=" div-1">
//                   <div className="details-bar">
//                     <p>شماره درخواست:</p>
//                     <p>{missionDetail?.requestNumber}</p>
//                   </div>
//                   <div className="details-bar">
//                     <p>زمان مراجعه:</p>
//                     <p>
//                       {DateHelper.isoDateTopersian(missionDetail?.presenceDateTime)}-{missionDetail?.presenceShift}
//                     </p>
//                   </div>
//                   <div className="details-bar">
//                     <p>نام مشتری:</p>
//                     <p>
//                       {missionDetail?.consumerFirstName} {missionDetail?.consumerLastName}
//                     </p>
//                   </div>
//                   <div className="details-bar">
//                     <p>آدرس:</p>
//                     <p className="m-1">{missionDetail?.address}</p>
//                   </div>
//                 </div>
//                 <div className="div-2">
//                   <div
//                     className=""
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'space-between',
//                       // width: '85%',
//                       padding: '10px 0',
//                     }}
//                   >
//                     <span>
//                       {missionDetail?.serviceTypeTitle}-{missionDetail?.productTypeTitle}
//                     </span>
//                     {missionDetail?.statusTitle && (
//                       <Select
//                         isSearchable={false}
//                         isDisabled={selectDisabled}
//                         isLoading={loading}
//                         className="select-city"
//                         options={statusList}
//                         placeholder={missionDetail?.statusTitle}
//                         onChange={(e) => {
//                           if (e?.value == 2) setSuspendReasonModalVisible(true), setBackgroundDimmer(true);
//                           else if (e?.value == 5) setProgressReasonModalVisible(true), setBackgroundDimmer(true);
//                           else setBackgroundDimmer(true), setConfirmModalVisible(true), setStatusValue(e?.value!);
//                         }}
//                       />
//                     )}
//                   </div>
//                   <div className="" style={{ width: '90%', padding: '10px 0' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
//                       {/* Generate Form here */}
//                       {genForm && (
//                         <>
//                           <Form
//                             children={true}
//                             // onSubmit={onSubmit}
//                             schema={genForm.attributes}
//                             formData={genForm.attributeValues}
//                             uiSchema={uiSchema}
//                           />
//                           {/* <Button className="btn btn-info" style={{ marginTop: '10px', width: '100%' }} type="submit">
//                               بروزرسانی
//                             </Button> */}
//                         </>
//                       )}
//                       <div>
//                         <p style={{ marginBottom: '0' }}>ایرادات</p>
//                         <ul>
//                           {missionDetail?.problemList &&
//                             missionDetail?.problemList.length > 0 &&
//                             missionDetail.problemList.map((problems: IProblemList, index: number) => {
//                               return <li>{problems.label}</li>;
//                             })}
//                         </ul>
//                       </div>
//                       {missionDetail?.description && (
//                         <div>
//                           <p> توضیحات :</p>
//                           {missionDetail?.description}
//                         </div>
//                       )}
//                     </div>

//                     {missionDetail?.audioMessage && (
//                       <div className="d-flex justify-content-center m-3">
//                         <audio src={missionDetail?.audioMessage} controls />
//                       </div>
//                     )}

//                     <div style={{ display: 'block' }}>
//                       {missionDetail?.videoMessage && (
//                         <div style={{ display: 'flex', justifyContent: 'center' }}>
//                           <video
//                             width="320"
//                             height="240"
//                             controls
//                             style={{ display: 'flex', alignContent: 'center' }}
//                             src={missionDetail?.videoMessage}
//                           />
//                         </div>
//                       )}
//                       <div style={{ display: 'flex', justifyContent: 'inherit', flexWrap: 'wrap' }}>
//                         {missionDetail?.imageMessage &&
//                           missionDetail?.imageMessage.length > 0 &&
//                           missionDetail?.imageMessage.map((imageAddress: string, index: number) => {
//                             return (
//                               <img
//                                 style={{ maxWidth: '85px', cursor: 'pointer' }}
//                                 className="m-2"
//                                 onClick={() => {
//                                   setImageUrl(imageAddress);
//                                   setImageModalVisible(true);
//                                 }}
//                                 src={imageAddress}
//                               />
//                             );
//                           })}
//                       </div>
//                     </div>
//                     {/* Technician Media list */}
//                     {/* <div>
//                         {missionDetail?.audioMessage && (
//                       <div className="d-flex justify-content-center m-3">
//                         <audio src={missionDetail?.audioMessage} controls />
//                       </div>
//                     )}

//                     <div style={{ display: 'block' }}>
//                       {missionDetail?.videoMessage && (
//                         <div style={{ display: 'flex', justifyContent: 'center' }}>
//                           <video
//                             width="320"
//                             height="240"
//                             controls
//                             style={{ display: 'flex', alignContent: 'center' }}
//                             src={missionDetail?.videoMessage}
//                           />
//                         </div>
//                       )}
//                       <div style={{ display: 'flex', justifyContent: 'inherit', flexWrap: 'wrap' }}>
//                         {missionDetail?.imageMessage &&
//                           missionDetail?.imageMessage.length > 0 &&
//                           missionDetail?.imageMessage.map((imageAddress: string, index: number) => {
//                             return (
//                               <img
//                                 style={{ maxWidth: '85px', cursor: 'pointer' }}
//                                 className="m-2"
//                                 onClick={() => {
//                                   setImageUrl(imageAddress);
//                                   setImageModalVisible(true);
//                                 }}
//                                 src={imageAddress}
//                               />
//                             );
//                           })}
//                       </div>
//                     </div>
//                         </div> */}
//                     <div
//                       style={{
//                         padding: '20px 0',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'space-evenly',
//                         width: '50%',
//                         margin: '0 auto',
//                       }}
//                     >
//                       {/* Action */}
//                       <span className="contact">
//                         {loading ? (
//                           <Spinner style={{ width: '1rem', height: '1rem' }} />
//                         ) : (
//                           <i
//                             className="fa-solid fa-location-crosshairs"
//                             onClick={() =>
//                               navigate(`${URL_TECHNICIAN_MISSION_DETAIL_ACTION}`, {
//                                 state: {
//                                   requestDetailId: missionDetail?.requestDetailId,
//                                   productCategoryId: missionDetail?.productCategoryId,
//                                 },
//                               })
//                             }
//                           />
//                         )}
//                       </span>
//                       {/* Call */}
//                       <span className="contact">
//                         <i className="fa fa-phone" onClick={() => window.open(`tel:${missionDetail?.consumerPhoneNumber}`)} />
//                       </span>
//                       {/* Images */}
//                       <span className="contact">
//                         <label htmlFor="img" style={{ cursor: 'pointer' }}>
//                           <i className="fa fa-camera" />
//                         </label>
//                         <Input
//                           onChange={onImageFileChange}
//                           style={{ display: 'none' }}
//                           id="img"
//                           type="file"
//                           accept="image/*"
//                         />
//                       </span>
//                       {/* Video */}
//                       <span className="contact">
//                         <label htmlFor="video" style={{ cursor: 'pointer' }}>
//                           <i className="fa fa-video" />
//                         </label>
//                         <Input
//                           onChange={onVideoFileChange}
//                           style={{ display: 'none' }}
//                           id="video"
//                           type="file"
//                           capture="user"
//                           accept="video/*"
//                         />
//                       </span>
//                       {/* Voice */}
//                       <span className="contact" hidden={isRecording}>
//                         <i
//                           className="fa fa-microphone"
//                           onClick={() => {
//                             startRecording();
//                             setAudioDisplay('initial');
//                           }}
//                         />
//                       </span>
//                       <span className="contact" hidden={!isRecording}>
//                         <i
//                           className="fa fa-stop"
//                           onClick={() => {
//                             stopRecording();
//                           }}
//                         />
//                       </span>
//                       {/* Message FollowUp */}
//                       <span className="contact">
//                         <i
//                           className="fa fa-message"
//                           onClick={() => {
//                             setFollowUpModalVisible(true);
//                             setBackgroundDimmer(true);
//                           }}
//                         />
//                       </span>
//                       <span className="contact">
//                         <i
//                           className="fa fa-file"
//                           onClick={() => {
//                             navigate(`${URL_TECHNICIAN_REQUEST}`, {
//                               state: {
//                                 requestDetailId: missionDetail?.requestDetailId,
//                                 productCategoryId: missionDetail?.productCategoryId,
//                                 consumerFullName: missionDetail?.consumerFirstName + ' ' + missionDetail?.consumerLastName,
//                                 consumerAddress: missionDetail?.address,
//                                 requestNumber: missionDetail?.requestNumber,
//                               },
//                             });
//                           }}
//                         />
//                       </span>
//                     </div>
//                   </div>
//                   {/* Voice */}
//                   <div style={{ width: '100%', display: `${audioDisplay}` }}>
//                     <div className="d-flex m-3">
//                       <div className="d-flex" style={{ width: '80%' }}>
//                         {/* {missionDetail?.audioMessage && (
//                           <div className="d-flex justify-content-center m-3">
//                             <audio src={missionDetail?.audioMessage} controls />
//                           </div>
//                         )} */}
//                         <audio
//                           style={{
//                             width: '-webkit-fill-available',
//                           }}
//                           hidden={isRecording}
//                           src={audioURL}
//                           controls
//                         />
//                       </div>
//                       <div className="d-flex justify-content-around" style={{ width: '20%' }}>
//                         <img
//                           hidden={isRecording}
//                           style={{ cursor: 'pointer' }}
//                           src={require('@src/scss/images/delete.png')}
//                           onClick={() => {
//                             setAudioFile(null);
//                             setAudioDisplay('none');
//                           }}
//                           width="46"
//                           height="46"
//                           alt=""
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   {/* Images */}
//                   <div style={{ width: '100%', display: `${imageDisplay}` }}>
//                     <div className="d-flex m-3">
//                       <div className="d-flex flex-wrap" style={{ width: '80%' }}>
//                         {imgSrcList &&
//                           imgSrcList.length > 0 &&
//                           imgSrcList.map((item: any, index: number) => {
//                             return <img className="m-1" width="75" height="75" src={item} />;
//                           })}
//                       </div>
//                       <div className="d-flex justify-content-around" style={{ width: '20%' }}>
//                         <img
//                           className="pointer"
//                           src={require('@src/scss/images/delete.png')}
//                           onClick={() => {
//                             setImgSrcList([]);
//                             setImageFile([]);
//                             setImageDisplay('none');
//                           }}
//                           width="46"
//                           height="46"
//                           alt=""
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   {/* Video */}
//                   <div style={{ width: '100%', display: `${videoDisplay}` }}>
//                     <div className="d-flex m-3">
//                       <div className="d-flex" style={{ width: '80%' }}>
//                         <video id="video" style={{ width: 'inherit', height: 'inherit' }} controls>
//                           مرور گر شما از ویدیو پشتیبانی نمیکند
//                         </video>
//                       </div>
//                       <div className="d-flex justify-content-around" style={{ width: '20%' }}>
//                         <img
//                           style={{ zIndex: '1', cursor: 'pointer' }}
//                           src={require('@src/scss/images/delete.png')}
//                           onClick={() => {
//                             setVideoFile(null);
//                             setVideoDisplay('none');
//                           }}
//                           width="46"
//                           height="46"
//                           alt=""
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="m-2">
//                   <Button
//                     style={{ width: '100%' }}
//                     hidden={!showButton}
//                     onClick={(e) => {
//                       submitTechnicianMedia();
//                     }}
//                     className="btn m-1"
//                   >
//                     {loading ? <Spinner /> : ' افزودن فایل های بیشتر'}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             {/* followup list */}
//             {followUpList &&
//               followUpList.length > 0 &&
//               followUpList.map((item: IFollowUpList, index: number) => {
//                 return (
//                   <div className="section-1 w100-40">
//                     <div className="row mb-2">
//                       <div className="col-6">تاریخ و زمان</div>
//                       <div className="col-6" style={{ textAlign: 'left' }}>
//                         {DateHelper.splitTime(item.createDateTime)} - {DateHelper.isoDateTopersian(item.createDateTime)}
//                       </div>
//                     </div>

//                     <div className="row mb-2">
//                       <div className="col-12"> {item.description}</div>
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </div>

//       {/*
//       <FollowUpModal
//         followUpModalVisible={followUpModalVisible}
//         AddFollowUp={AddFollowUp}
//         loading={loading}
//         onChange={(e: any) => setFollowUpDescription(e.currentTarget.value)}
//       />
//       <SuspendCauseModal
//         suspendReasonModalVisible={suspendReasonModalVisible}
//         missionDetail={missionDetail}
//         statusList={statusList}
//         onChange={(e: any) => {
//           setFollowUpDescription((Array.isArray(e) ? e.map((x) => x.label) : []).toString());
//           setSuspendCasueList(Array.isArray(e) ? e.map((x) => x.value) : []);
//         }}
//         onClick={() => {
//           UpdateStatus(2, suspendCauseList), AddFollowUp();
//         }}
//         loading={loading}
//       />

//       <ProgressCauseModal
//         missionDetail={missionDetail}
//         statusList={statusList}
//         progressReasonModalVisible={progressReasonModalVisible}
//         onChange={(e: any) => {
//           setFollowUpDescription((Array.isArray(e) ? e.map((x) => x.label) : []).toString());
//           setProgressCasueList(Array.isArray(e) ? e.map((x) => x.value) : []);
//         }}
//         onClick={() => {
//           UpdateStatus(5, progressCauseList);
//           AddFollowUp();
//         }}
//         loading={loading}
//       />

//       <div
//         className={`menu menu-box-modal rounded-m ${imageModalVisible ? 'menu-active' : ''}`}
//         style={{
//           backgroundImage: `url("${imageUrl}")`,
//           backgroundRepeat: 'round',
//           backgroundAttachment: 'fixed',
//           backgroundSize: 'cover',
//         }}
//         data-menu-height="cover"
//         data-menu-width="cover"
//         onClick={() => setImageModalVisible(false)}
//       />

//       <ConfirmModal
//         confirmModalVisible={confirmModalVisible}
//         accept={() => {
//           setConfirmModalVisible(false), setBackgroundDimmer(false), UpdateStatus(statusValue!);
//         }}
//         reject={() => {
//           setConfirmModalVisible(false), setBackgroundDimmer(false);
//         }}
//       /> */}
//     </div>
//   </>
//    );
//  }

//  export default ;
