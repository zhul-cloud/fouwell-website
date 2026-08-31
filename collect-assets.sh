#!/bin/zsh
# Fouwell website asset collection
set -e
SRC=/Users/mac/Documents/llm-wiki/raw
DST=/Users/mac/Documents/llm-wiki/fouwell-website/assets
mkdir -p "$DST/products"

# Logos
cp "$SRC/assets/brand/Fouwell.png" "$DST/logo.png"
cp "$SRC/assets/brand/Logo800*800(店铺Logo)_透明底.png" "$DST/logo-square.png"
cp "$SRC/assets/brand/头像.jpg" "$DST/kevin.jpg"

# Brand banner images
mkdir -p "$DST/brand"
cp "$SRC/assets/brand/全品类.png" "$DST/brand/all-categories.png"
cp "$SRC/assets/brand/西门子.png" "$DST/brand/siemens.png"
cp "$SRC/assets/brand/施耐德.png" "$DST/brand/schneider.png"
cp "$SRC/assets/brand/台达.png" "$DST/brand/delta.png"
cp "$SRC/assets/brand/VEGA.jpg" "$DST/brand/vega.jpg"
cp "$SRC/assets/brand/步科.png" "$DST/brand/kinco.png"

# Product photos: model -> source (first photo)
copy() { cp "$1" "$DST/products/$2"; }

copy "$SRC/products/ABB/Cable/PlasticFibreOptic/61059113/photos/61059113_01.jpg" "61059113.jpg"
copy "$SRC/products/ABB/Cable/RPLC-03C/3ABD64644521/photos/3ABD64644521_01.jpg" "3ABD64644521.jpg"
copy "$SRC/products/ABB/DriveBoard/AGDR-71C/68561906A/photos/68561906A_01.png" "68561906A.png"
copy "$SRC/products/ABB/DriveBoard/AIBP/3AFE68257913/photos/3AFE68257913_01.jpg" "3AFE68257913.jpg"
copy "$SRC/products/ABB/DriveBoard/APOW-01C/3AFE68249457/photos/3AFE68249457_01.jpg" "3AFE68249457.jpg"
copy "$SRC/products/AllenBradley/ServoAmplifier/Kinetix350/2097-V34PR6-LM/photos/2097-V34PR6-LM_01.jpg" "2097-V34PR6-LM.jpg"
copy "$SRC/products/AllenBradley/SoftStarter/SMC-3/150-C30NBD/photos/150-C30NBD_01.jpg" "150-C30NBD.jpg"
copy "$SRC/products/Barksdale/PressureSwitch/B2T/B2T-A48SS-P5/photos/B2T-A48SS-P5_02.jpg" "B2T-A48SS-P5.jpg"
copy "$SRC/products/CX/Encoder/CSP50/CSP50-8-500BZ-5-30TG5/photos/CSP50-8-500BZ-5-30TG5_01.jpg" "CSP50-8-500BZ-5-30TG5.jpg"
copy "$SRC/products/DPG/GearMotor/5IK120GN-CF/5GN-20-K/photos/5GN-20-K_01.jpg" "5GN-20-K.jpg"
copy "$SRC/products/Delta/PLC/AS200/AS228P-A/photos/AS228P-A_01.jpg" "AS228P-A.jpg"
copy "$SRC/products/Delta/ServoAmplifier/ASDA-B3/ASD-B3-0721-M/photos/ASD-B3-0721-M_01.jpg" "ASD-B3-0721-M.jpg"
copy "$SRC/products/FANOX/VoltageRelay/U3N/U3N-400/photos/U3N-400_01.jpg" "U3N-400.jpg"
copy "$SRC/products/Honeywell/ProximitySensor/943/943-F4V-2D-1C0-300E/photos/943-F4V-2D-1C0-300E_01.jpg" "943-F4V-2D-1C0-300E.jpg"
copy "$SRC/products/LS/Inverter/G100/LSLV0004G100-4E0NN/photos/LSLV0004G100-4E0NN_02.jpg" "LSLV0004G100-4E0NN.jpg"
copy "$SRC/products/LS/PositioningModule/XGT/XGF-PD4H/photos/XGF-PD4H_01.jpg" "XGF-PD4H.jpg"
copy "$SRC/products/Mitsubishi/ServoAmplifier/MELSERVO-J3/MR-J3-60B/photos/MR-J3-60B_01.jpg" "MR-J3-60B.jpg"
copy "$SRC/products/OMRON/HMI/NS10/NS10-TV01B-V2/photos/NS10-TV01B-V2_01.jpg" "NS10-TV01B-V2.jpg"
copy "$SRC/products/OMRON/Servo/G5/R88M-KE75030H/photos/R88M-KE75030H_01.jpg" "R88M-KE75030H.jpg"
copy "$SRC/products/OMRON/ServoAmplifier/G5/R88D-KN08H-ECT/photos/R88D-KN08H-ECT_01.jpg" "R88D-KN08H-ECT.jpg"
copy "$SRC/products/POSITAL/Encoder/OCD-DPC1B/OCD-DPC1B-1212-C100-H3P/photos/OCD-DPC1B-1212-C100-H3P_02.jpg" "OCD-DPC1B-1212-C100-H3P.jpg"
copy "$SRC/products/Pro-face/HMI/GP4000/PFXGP4301TADW/photos/PFXGP4301TADW_01.jpg" "PFXGP4301TADW.jpg"
copy "$SRC/products/Rexroth/Filter/H6XL/1.0630-H6XL-A00-0-M/photos/1.0630-H6XL-A00-0-M_02.jpg" "1.0630-H6XL-A00-0-M.jpg"
copy "$SRC/products/Schneider/Inverter/Altivar12/ATV12HU15M2/photos/ATV12HU15M2_01.jpg" "ATV12HU15M2.jpg"
copy "$SRC/products/Schneider/ProtectionRelay/LT3SA/LT3-SA00M/photos/LT3-SA00M_01.jpg" "LT3-SA00M.jpg"
copy "$SRC/products/Siemens/MotorStarter/3RM1/3RM1002-1AA04/photos/3RM1002-1AA04_01.jpg" "3RM1002-1AA04.jpg"
copy "$SRC/products/Siemens/PLC/S7-1200/6ES7212-1AE40-0XB0/photos/6ES7212-1AE40-0XB0_03.jpg" "6ES7212-1AE40-0XB0.jpg"
copy "$SRC/products/TURCK/ProximitySensor/Ni5-G12K/Ni5-G12K-AP6X/photos/Ni5-G12K-AP6X_01.jpg" "Ni5-G12K-AP6X.jpg"
copy "$SRC/products/Tianhe/Potentiometer/WDJ36/WDJ36-II/photos/WDJ36_01.jpg" "WDJ36-II.jpg"
copy "$SRC/products/VEGA/LevelMeter/VEGAPULS6X/PS6X.2SWYDBXATKMKHAXXXXXXX/photos/PS6X.2SWYDBXATKMKHAXXXXXXX_01.jpg" "PS6X.2SWYDBXATKMKHAXXXXXXX.jpg"
copy "$SRC/products/VEGA/LevelMeter/VEGAPULS6X/PS6X.2SWYDBXATKMKHAXXXXXXX/photos/PS6X.2SWYDBXATKMKHAXXXXXXX_04.jpg" "VEGAPULS-6X.jpg"
copy "$SRC/products/VEGA/LevelMeter/VEGAPULS6X/PS6X.2SWYDBXATKMKHAXXXXXXX/photos/PS6X.2SWYDBXATKMKHAXXXXXXX_06.jpg" "VEGAPULS-64.jpg"
copy "$SRC/products/Weidmuller/InterfaceModule/SKH/SKH-F48/photos/SKH-F48_01.jpg" "SKH-F48.jpg"
copy "$SRC/products/Yaskawa/Inverter/A1000/CIMR-AB4A0011FBA/photos/CIMR-AB4A0011FBA_01.jpg" "CIMR-AB4A0011FBA.jpg"
copy "$SRC/products/Yaskawa/Servo/SGMAH/SGMAH-04ADA-TF13/photos/SGMAH-04ADA-TF13_02.jpg" "SGMAH-04ADA-TF13.jpg"

echo "DONE"; ls "$DST/products" | wc -l
