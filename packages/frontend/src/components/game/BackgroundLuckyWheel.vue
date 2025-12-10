<style scoped>
  .page {
	min-width: 100vw;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
}
.picture {
  position: absolute;
    z-index: 9999;
    left: 86px;
    width: 1728px;
    height: 966px;
    overflow: hidden;
}
.picture *, .picture *:before, .picture *:after {
		content: '';
		position: absolute;
	}
.forest {
	top: 81px;    left: -22px;
	width: 648px; height: 467px;
	background: #00172A;
	overflow: hidden;
}
	.forest__tree {
		top: 0px;    left: 320px;
		width: 22px; height: 483px;
		background: #012135;
		box-shadow: 29px 0 0 6px #012135, -78px 0 0 1px #012135;
	}
		.forest__tree:before {
			top: 0px;    left: -235px;
			width: 65px; height: 161px;
			border-left: 22px solid #012135;
			border-bottom: 16px solid #012135;
			border-radius: 0 0 0 40px;
		}
	.forest__monster-1 {
		top: 118px;    left: 395px;
		width: 238px; height: 290px;
		background: #263449;
		border-radius: 60px 60px 0 0;
		transform-origin: bottom center;
		transform: rotate(-19deg);
		animation: monster1 30s linear infinite;
	}
		.forest__monster-1:before {
			top: -21px; left: 17px;
			border-right: 89px solid transparent;
			border-bottom: 69px solid #263449;
		}
		.forest__monster-1:after {
			top: -21px; left: 119px;
			border-left: 89px solid transparent;
			border-bottom: 69px solid #263449;
		}
		.forest__monster-1 div:nth-child(1) {
			top: 52px;   left: 86px;
			width: 45px; height: 55px;
			border-radius: 10px;
			background: #012135;
		}
			.forest__monster-1 div:nth-child(1):before {
				top: 0px;    left: -138px;
				width: 32px; height: 258px;
				border-radius: 50px 0 0 0;
				border-left: 43px solid #263449;
				border-top: 40px solid #263449;
				transform-origin: top right;
				transform: rotate(12deg);
			}
			.forest__monster-1 div:nth-child(1):after {
				top: -13px;   left: 121px;
				width: 32px; height: 258px;
				border-radius: 0 50px 0 0;
				border-right: 43px solid #263449;
				border-top: 40px solid #263449;
				transform-origin: top left;
				transform: rotate(-12deg);
			}
		.forest__monster-1 div:nth-child(2) {
			top: 37px;   left: 32px;
			width: 80px; height: 60px;
			border-radius: 50%;
			background: #012135;
			box-shadow: 74px 3px 0 0 #012135;
			z-index: 1;
		}
			.forest__monster-1 div:nth-child(2):before {
				top: 21px;  left: 13px;
				width: 17px; height: 13px;
				border-radius: 50%;
				background: #224179;
				box-shadow: 108px 7px 0 0 #224179;
				animation: monster1Eyes 30s linear infinite;
			}
			.forest__monster-1 div:nth-child(2):after {
				top: 53px;   left: 52px;
				width: 24px; height: 23px;
				border-radius: 20px 20px 0 0;
				border-top: 8px solid #012135;
				border-left: 11px solid #012135;
				border-right: 11px solid #012135;
			}
	.forest__monster-2 {
		top: 200px;  left: 50px;
		width: 188px; height: 68px;
		border-radius: 45px 45px 4px 4px;
		background: #182B41;
		animation: monster2 30s linear infinite;
	}
		.forest__monster-2:before {
			top: 37px;   left: -4px;
			width: 194px; height: 198px;
			border-radius: 50px 50px 0 0;
			background: #182B41;
		}
		.forest__monster-2:after {
			top: 97px;   left: -35px;
			width: 43px; height: 129px;
			border-radius: 17px 0 0 0;
			background: #182B41;
		}
		.forest__monster-2 div {
			top: -29px;  left: 24px;
			width: 97px; height: 35px;
			border-radius: 35px;
			border-left: 22px solid #182B41;
			border-bottom: 16px solid #182B41;
			border-right: 22px solid #182B41;
		}
			.forest__monster-2 div:before {
				top: 50px;  left: 15px;
				width: 17px; height: 13px;
				border-radius: 50%;
				background: #224179;
				box-shadow: 22px 0 0 0 #224179;
				animation: monster2Eyes 30s linear infinite;
			}
	.forest__ghost {
		top: 290px; left: 389px;
		width: 52px; height: 39px;
		border-radius: 20px;
		background: #1C596C;
		animation: forestGhost 30s linear infinite;
	}
		.forest__ghost:after {
			top: 16px; left: 11px;
			width: 11px; height: 10px;
			border-radius: 50% 30% 40% 50%;
			background: #273449;
			box-shadow: 10px 0 0 0 #273449;
		}
		.forest__ghost div:before {
			top: 10px; left: 0px;
			width: 30px; height: 68px;
			border-radius: 10px;
			background: #1C596C;
			transform-origin: 7px 7px;
			transform: rotate(0deg);
			animation: forestGhostLeg 30s linear infinite;
		}
		.forest__ghost div:after {
			top: 10px; left: 22px;
			width: 30px; height: 60px;
			border-radius: 10px;
			background: #1C596C;
			transform-origin: 7px 7px;
			transform: rotate(0deg);
			animation: forestGhostLeg 30s linear infinite;
		}
	.forest__moss {
		top: 61px;   left: 43px;
		width: 91px; height: 6px;
		background: #30403F;
		border-radius: 0 0 10px 0;
	}
		.forest__moss:before {
			top: -39px; left: 13px;
			width: 13px; height: 93px;
			background: #30403F;
			border-radius: 0 0 5px 5px;
			box-shadow: -28px 35px 0 3px #30403F, 120px 3px 0 2px #30403F;
		}
	.house__wall {
    display:none;
		top: 39px;
		height: 325px; width: 497px;
		border-top: 103px solid #1A252F;
		border-right: 1231px solid #1A252F;
		border-bottom: 499px solid #1A252F;
		box-shadow: 0 -25px 0 0 #2A2F39;
	}
		.house__wall:before {
			top: -370px; left: 112px;
			width: 82px; height: 628px;
			background: #32323C;
			transform: rotate(68deg);
			z-index: 100;
		}
		.house__wall:after {
			top: -370px; left: 1534px;
			width: 82px; height: 628px;
			background: #32323C;
			transform: rotate(-68deg);
			z-index: 100;
		}
	.house__window {
		top: 142px;     left: 497px;
		height: 327px; width: 52px;
		background: #32323C;
		box-shadow: inset 0 7px 0 0 #292939, -128px 0 0 0 #292939;
	}
		.house__window:before {
			top: -68px;   left: -540px;
			height: 68px; width: 635px;
			background: #32323C;
		}
		.house__window:after {
			top: 325px;   left: -540px;
			height: 58px; width: 540px;
			background: #2A2F39;
			box-shadow: inset 0 9px 0 0 #3B4A3E;
		}
.shelf {
	top: 287px;   left: 1149px;
	width: 579px; height: 16px;
	background: #292939;
	box-shadow: 0 -6px 0 0 #32323C, 0 -75px 0 0 #292939, 0 -81px 0 0 #32323C, 0 51px 0 0 #32323C;
}
	.shelf:before {
		top: -242px;   left: -37px;
		height: 430px; width: 37px;
		border-radius: 9px;
		background: #32323C;
	}
	.shelf__staff-1 {
		top: -204px;  left: 28px;
		height: 74px; width: 102px;
		border-radius: 8px;
		background: #183133;
	}
		.shelf__staff-1:before {
			top: -11px;   left: 19px;
			width: 60px; height: 11px;
			background: #304252;
		}
		.shelf__staff-1:after {
			top: 21px;    left: 28px;
			height: 35px; width: 48px;
			border-radius: 50%;
			background: #162532;
		}
	.shelf__staff-2 {
		top: -180px;  left: 134px;
		height: 50px; width: 86px;
		box-sizing: border-box;
		background: linear-gradient(to bottom, #263449 38%, #1C596C 39%);
		border: 6px solid #263449;
		border-radius: 13px;
	}
		.shelf__staff-2:before {
			top: -23px;  left: 17px;
			width: 24px; height: 14px;
			background: #263449;
		}
		.shelf__staff-2:after {
			top: -35px;  left: 13px;
			width: 35px; height: 13px;
			background: #304252;
		}
		.shelf__staff-2 .dust-1 {
			top: -66px; left: -17px;
			width: 6px; height: 5px;
			background: #1c586c;
			z-index: 1;
			animation: shelfStaff2Dust1 5s linear infinite;
		}
		.shelf__staff-2 .dust-2 {
			top: -52px; left: -30px;
			width: 9px; height: 6px;
			background: #1c586c;
			z-index: 1;
			animation: shelfStaff2Dust2 5s linear -2.6s infinite;
		}
		.shelf__staff-2 .dust-3 {
			top: -61px; left: 9px;
			width: 6px; height: 5px;
			background: #1c586c;
			z-index: 1;
			animation: shelfStaff2Dust3 5s linear -1s infinite;
		}
		.shelf__staff-2 .dust-4 {
			top: -55px; left: 26px;
			width: 4px; height: 3px;
			background: #1c586c;
			z-index: 1;
			animation: shelfStaff2Dust4 5s linear -2.7s infinite;
		}
	.shelf__staff-3 {
		top: -201px; left: 233px;
		width: 127px; height: 45px;
		border-radius: 2px 2px 30px 30px;
		background: #393939;
	}
		.shelf__staff-3:before {
			top: 45px;   left: 48px;
			width: 30px; height: 19px;
			background: #393939;
		}
		.shelf__staff-3:after {
			top: 58px;   left: 26px;
			width: 73px; height: 13px;
			border-radius: 10px 10px 0 0;
			background: #393939;
		}
	.shelf__staff-4 {
		top: -209px; left: 376px;
		width: 67px; height: 63px;
		background: #21314A;
	}
		.shelf__staff-4:before {
			top: 63px;   left: -9px;
			width: 86px; height: 18px;
			border-radius: 2px 2px 0 0;
			background: #21314A;
		}
		.shelf__staff-4:after {
			top: -39px;  left: 99px;
			width: 65px; height: 118px;
			background: #183133;
		}
	.shelf__staff-5 {
		top: -145px;  left: 13px;
		width: 60px; height: 14px;
		border-radius: 10px;
		background: #3B4358;
	}
		.shelf__staff-5:before {
			top: -13px;   left: 13px;
			width: 35px; height: 13px;
			border-radius: 2px 2px 10px 10px;
			background: #405B58;
		}
		.shelf__staff-5:after {
			top: -29px;  left: 19px;
			width: 22px; height: 16px;
			border-radius: 50%;
			background: #3B4358;
		}
	.shelf__staff-6 {
		top: -138px;  left: 307px;
		width: 164px; height: 10px;
		background: #3B4A3E;
	}
		.shelf__staff-6:before {
			top: -19px; left: 93px;
			width: 13px; height: 27px;
			background: #3B4A3E;
			box-shadow: 24px -17px #3B4A3E, 24px -24px #3B4A3E;
			transform: rotate(45deg);
		}
		.shelf__staff-6:after {
			top: 2px;   left: 130px;
			width: 13px; height: 27px;
			background: #3B4A3E;
			transform: rotate(-45deg);
		}
	.shelf__staff-7 {
		top: -100px;  left: 0px;
		width: 56px; height: 93px;
		box-shadow: inset -14px 0 0 0 #263449, inset 0 -50px 0 0 #525242;
	}
		.shelf__staff-7:before {
			top: 10px;   left: 32px;
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #1C596C;
		}
		.shelf__staff-7:after {
			top: 39px;   left: 26px;
			width: 30px; height: 31px;
			background: #1C596C;
		}
	.shelf__staff-8 {
		top: -68px;  left: 268px;
		width: 147px; height: 58px;
		border-radius: 8px 8px 0 0;
		background: #52383C;
		box-shadow: inset 0 44px 0 -30px #3A3031;
	}
		.shelf__staff-8:before {
			top: 26px;   left: 60px;
			width: 24px; height: 18px;
			border-radius: 50%;
			background: #3A3031;
		}
		.shelf__staff-8:after {
			top: -16px;  left: 30px;
			width: 86px; height: 16px;
			box-sizing: border-box;
			border-radius: 10px 10px 0 0;
			border-top: 6px solid #5D4E42;
			border-left: 22px solid #5D4E42;
			border-right: 22px solid #5D4E42;
		}
		.shelf__staff-8 .dust-1 {
			top: -23px; left: 30px;
			width: 9px; height: 6px;
			background: #5d4e42;
			z-index: 1;
			animation: shelfStaff2Dust1 5s linear infinite;
		}
		.shelf__staff-8 .dust-2 {
			top: 3px;   left: 43px;
			width: 9px; height: 6px;
			background: #5d4e42;
			z-index: 1;
			animation: shelfStaff2Dust2 5s linear -1s infinite;
		}
		.shelf__staff-8 .dust-3 {
			top: 10px;   left: 91px;
			width: 9px; height: 6px;
			background: #5d4e42;
			z-index: 1;
			animation: shelfStaff2Dust3 5s linear -2.5s infinite;
		}
		.shelf__staff-8 .dust-4 {
			top: 11px;   left: 108px;
			width: 9px; height: 6px;
			background: #5d4e42;
			z-index: 1;
			animation: shelfStaff2Dust4 5s linear -4.1s infinite;
		}
	.shelf__staff-9 {
		top: -87px;  left: 449px;
		width: 104px; height: 81px;
		box-sizing: border-box;
		border: 7px solid #393939;
		background: #1A252F;
	}
	@supports (-webkit-box-reflect: left) {
		.shelf__staff-9:before {
			top: 11px;    left: 37px;
			width: 32px; height: 23px;
			background: #52383C;
			border-radius: 70% 0;
			-webkit-box-reflect: left 1px;
		}
		.shelf__staff-9:after {
			top: 37px;  left: 37px;
			width: 19px; height: 14px;
			background: #52383C;
			border-radius: 0 60%;
			-webkit-box-reflect: left 1px;
		}
	}
	.shelf__staff-10 {
		top: -64px;  left: 48px;
		width: 26px; height: 63px;
		background: #263449;
		box-shadow: 24px 17px 0 0 #3C313C;
		transform-origin: right top;
		transform: rotate(-45deg);
	}
		.shelf__staff-10:before {
			top: 92px;   left: 65px;
			width: 168px; height: 16px;
			background: #30403F;
			border-radius: 0 100% 100% 0;
			transform-origin: 0 0;
			transform: rotate(45deg);
		}
		.shelf__staff-10:after {
			top: 87px;  left: 95px;
			width: 15px; height: 45px;
			background: #30403F;
		}
	.shelf__staff-11 {
		top: -34px;  left: 300px;
		width: 32px; height: 108px;
		background: #3b4a3e;
		border-radius: 0% 100%;
		transform: rotate(-43deg);
	}
		.shelf__staff-11:before {
			top: 5px;    left: -39px;
			width: 35px; height: 74px;
			background: #3b4a3e;
			border-radius: 100% 0;
			transform: rotate(17deg);
		}
	.shelf__herb-rope-1 {
		top: 81px;  left: 86px;
		width: 9px; height: 19px;
		border-radius: 4px;
		background: #524342;
		box-shadow: 8px 0 0 0 #524342, 4px 10px 0 0 #524342;
	}
	.shelf__herbs-1 {
		top: 109px; left: 71px;
		width: 17px;
		border-right: 19px solid transparent;
		border-left: 19px solid transparent;
		border-top: 29px solid #3B4A3E;
		transform: rotate(7deg);
		transform-origin: top center;
		animation: shelfHerbs1 2s ease infinite;
		animation-delay: -1.7s;
	}
		.shelf__herbs-1:before {
			top: 6px;    left: -32px;
			width: 82px; height: 61px;
			border-radius: 0 0 100% 0;
			background: #3B4A3E;
			transform: rotate(45deg);
		}
		.shelf__herbs-1:after {
			top: 26px;   left: 35px;
			width: 35px; height: 26px;
			background: #964554;
			border-radius: 50%;
			box-shadow: -38px 14px 0 0 #964554, -38px -1px 0 0 #964554;
		}
	.shelf__herb-rope-2 {
		top: -32px; left: 24px;
		width: 9px; height: 61px;
		border-radius: 4px;
		background: #524342;
		transform: rotate(17deg);
	}
		.shelf__herb-rope-2:before {
			top: 53px;  left: -11px;
			width: 9px; height: 23px;
			border-radius: 4px;
			background: #524342;
			transform: rotate(50deg);
		}
	.shelf__herbs-2 {
		top: 108px;  left: 153px;
		width: 6px; height: 89px;
		background: #3C5843;
		transform-origin: 15px -16px;
		transform: rotate(-14deg);
		animation: shelfHerbs2 2s ease infinite;
		animation-delay: -1.2s;
	}
		.shelf__herbs-2:before {
			top: 93px;   left: -17px;
			width: 41px; height: 31px;
			background: #3C5843;
			border-radius: 0 0 100% 0;
			transform: rotate(45deg);
		}
		@supports (-webkit-box-reflect: left) {
			.shelf__herbs-2:after {
				top: 68px;   left: 15px;
				width: 26px; height: 19px;
				background: #3C5843;
				border-radius: 0 80%;
				transform: rotate(-3deg);
				-webkit-box-reflect: left 11px;
			}
		}
	.shelf__herbs-3 {
		top: 95px;   left: 272px;
		width: 22px; height: 92px;
		border-radius: 0 0 10px 10px;
		background: linear-gradient(to right, transparent 32%, #30403F 33%, #30403F 67%, transparent 68%);
		box-shadow: inset 0 -45px 0 -40px #5A844F;
		transform-origin: 1px -8px;
		animation: shelfHerbs3 2s ease infinite;
		animation-delay: -0.9s;
	}
		.shelf__herbs-3:before {
			top: 0px;    left: -4px;
			width: 22px; height: 79px;
			border-radius: 0 0 10px 10px;
			background: linear-gradient(to right, transparent 32%, #30403F 33%, #30403F 67%, transparent 68%);
			box-shadow: inset 0 -45px 0 -40px #5A844F;
			transform: rotate(23deg);
		}
		.shelf__herbs-3:after {
			top: 0px;    left: 4px;
			width: 22px; height: 79px;
			border-radius: 0 0 10px 10px;
			background: linear-gradient(to right, transparent 32%, #30403F 33%, #30403F 67%, transparent 68%);
			box-shadow: inset 0 -45px 0 -40px #5A844F;
			transform: rotate(-23deg);
		}
	.shelf__herb-rope-3 {
		top: -16px; left: 6px;
		width: 9px; height: 24px;
		background: #524342;
		border-radius: 4px;
	}
	.shelf__herbs-4 {
		top: 158px;   left: 408px;
		width: 71px; height: 26px;
		background: #525242;
		border-radius: 20px;
		transform-origin: 22px -48px;
		animation: shelfHerbs4 2s ease infinite;
		animation-delay: -0.2s;
	}
		.shelf__herbs-4:before {
			top: -32px; left: 2px;
			width: 15px;
			border-left: 30px solid transparent;
			border-right: 22px solid transparent;
			border-bottom: 39px solid #525242;
		}
		.shelf__herbs-4:after {
			top: -48px; left: 4px;
			width: 17px;
			border-left: 22px solid transparent;
			border-right: 6px solid transparent;
			border-top: 27px solid #525242;
			transform: rotate(-28deg);
		}
	.shelf__herb-rope-4 {
		top: -79px; left: 43px;
		width: 9px; height: 52px;
		border-radius: 4px;
		background: #524342;
	}
		.shelf__herb-rope-4:before {
			top: 48px;   left: -24px;
			width: 30px; height: 6px;
			background: #524342;
			border-radius: 4px;
			transform: rotate(-20deg);
			z-index: 1;
		}
	.shelf__thing {
		top: -219px; left: -48px;
		width: 11px;  height: 172px;
		background: #233B37;
	}
		.shelf__thing:before {
			top: 0px; left: -58px;
			border-left: 60px solid transparent;
			border-top: 47px solid #233B37;
		}
		.shelf__thing:after {
			top: 84px; left: -52px;
			border-left: 54px solid transparent;
			border-top: 42px solid #233B37;
		}
	.shelf__circles {
		top: 74px;   left: -26px;
		width: 28px; height: 21px;
		border-radius: 50%;
		background: #3C313C;
		box-shadow: 32px 52px 0 0 #3C313C, 8px 54px 0 1px #3C313C, 0px 25px 0 3px #3C313C, 0px -26px 0 3px #3C313C;
		z-index: 1;
	}
.ladder {
	top: 494px;  left: 1404px;
	width: 35px; height: 504px;
	background: #312E36;
	border-radius: 10px;
	box-shadow: 94px 0 0 0 #312E36;
}
	.ladder:before {
		top: 32px;    left: 35px;
		height: 21px; width: 168px;
		background: #312E36;
		box-shadow: inset 0 5px 0 0 #393931;
	}
	.ladder:after {
		top: 97px;    left: 35px;
		height: 21px; width: 168px;
		background: #312E36;
		box-shadow: inset 0 5px 0 0 #393931;
	}
.wreath {
	top: 45px;   left: 855px;
	width: 134px; height: 100px;
	border: 15px solid #183133;
	border-radius: 50%;
}
	.wreath:before {
		top: 74px;  left: 50px;
		width: 11px; height: 32px;
		background: #183133;
		border-radius: 5px;
		transform: rotate(34deg);
		box-shadow: 26px -4px 0 0 #183133;
	}
	.wreath:after {
		top: 100px;  left: 15px;
		width: 11px; height: 32px;
		background: #183133;
		border-radius: 5px;
		transform: rotate(-34deg);
		box-shadow: 20px 25px 0 0 #183133, 22px 18px 0 0 #183133;
	}
.hook {
	top: 39px;  left: 1024px;
	width: 9px; height: 16px;
	border-radius: 0 0 0 2px;
	background: #304252;
}
	.hook:before {
		top: 21px;   left: -15px;
		width: 30px; height: 10px;
		border: 3px solid #304252;
		border-top: 0;
		border-radius: 0 0 8px 8px;
	}
	.hook:after {
		top: 11px;   left: 6px;
		width: 15px; height: 5px;
		border-top: 5px solid #304252;
		border-right: 6px solid #304252;
		border-radius: 0 7px 0 0;
	}
.dried-flower {
	top: 26px;  left: 0;
	width: 9px; height: 161px;
	background: #32323C;
	border-radius: 2px;
	transform-origin: 2px 2px;
	transform: rotate(4deg);
	animation: driedFlower 2s ease infinite;
}
	.dried-flower:before {
		top: 48px;  left: 0;
		width: 9px; height: 32px;
		background: #32323C;
		box-shadow: 20px 14px #32323C, 20px 20px #32323C;
		border-radius: 4px;
		transform-origin: 0 2px;
		transform: rotate(44deg);
	}
	.dried-flower:after {
		left: 4px;  top: 53px;
		width: 9px; height: 32px;
		background: #32323C;
		box-shadow: -20px 14px #32323C, -21px 20px #32323C;
		border-radius: 4px;
		transform: rotate(-44deg);
		transform-origin: 0 2px;
	}
	.dried-flower__petals {
		top: 142px;   left: -35px;
		width: 71px; height: 27px;
		background: #52383C;
		border-radius: 30px 30px 0 0;
	}
		.dried-flower__petals:before {
			top: 11px;    left: 22px;
			width: 30px; height: 23px;
			background: #52383C;
			transform: rotate(45deg);
		}
.greenery {
	top: -53px;   left: -454px;
	width: 216px; height: 19px;
	background: #183133;
	border-radius: 20px;
	box-shadow: -60px 13px 0 3px #183133;
}
	.greenery:before {
		top: 53px;   left: 194px;
		width: 199px; height: 14px;
		border-radius: 0 0 10px 10px;
		background: #30403F;
	}
	.greenery:after {
		top: 63px;   left: 210px;
		width: 43px; height: 24px;
		border-radius: 0 0 10px 10px;
		background: #30403F;
	}
.leaf-1 {
	top: -37px; left: -65px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(100deg);
}
	.leaf-1:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-2 {
	top: 23px; left: -15px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(-54deg);
}
	.leaf-2:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-3 {
	top: 81px; left: 15px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(54deg);
}
	.leaf-3:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-4 {
	top: 151px; left: -6px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(-54deg);
}
	.leaf-4:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-5 {
	top: 198px; left: -6px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(-66deg);
}
	.leaf-5:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-6 {
	top: 225px; left: 11px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(58deg);
}
	.leaf-6:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.leaf-7 {
	top: 353px; left: -84px;
	border-left: 22px solid transparent;
	border-right: 22px solid transparent;
	border-top: 24px solid #30403F;
	transform: rotate(-2deg);
	z-index: 1;
}
	.leaf-7:before {
		left: -11px;  top: -27px;
		width: 22px; height: 16px;
		background: #30403F;
		transform: rotate(39deg);
	}
.mushroom-1 {
	top: 290px;  left: -84px;
	width: 24px; height: 19px;
	background: #1C596C;
	border-radius: 100% 100% 2px 2px;
}
	.mushroom-1:before {
		top: 19px;  left: 6px;
		width: 11px; height: 16px;
		background: #3B4A3E;
	}
.mushroom-2 {
	top: 270px;  left: -50px;
	width: 24px; height: 23px;
	background: #1c596c;
	border-radius: 100% 100% 2px 2px;
}
	.mushroom-2:before {
		top: 23px;   left: 9px;
		width: 32px; height: 10px;
		border-left: 9px solid #3B4A3E;
		border-bottom: 6px solid #3B4A3E;
		border-radius: 0 0 0 4px;
	}
.lamp {
	top: 258px;  left: -432px;
	width: 69px; height: 35px;
	background: linear-gradient(to right, #203152 20%, #5A5A4A 21%, #5A5A4A 79%, #203152 80%);
	border-top: 26px solid #203152;
	box-shadow: 0 0 0 4px #00172A;
}
	.lamp:before {
		top: -74px; left: -9px;
		width: 13px;
		border-left: 37px solid transparent;
		border-right: 37px solid transparent;
		border-bottom: 42px solid #012135;
	}
	.lamp:after {
		top: -105px;  left: 17px;
		width: 26px; height: 29px;
		border-radius: 17px 17px 100% 100%;
		border: 2px solid #012135;
	}
.casket {
	top: 266px;  left: -324px;
	width: 58px; height: 47px;
	border: 4px solid #012135;
	background: linear-gradient(to bottom, #182B41 38%, #012135 39%, #012135 53%, #182B41 54%);
}
	.casket:before {
		top: -14px;   left: -17px;
		width: 93px; height: 10px;
		background: #012135;
		border-radius: 0 0 4px 4px;
	}
	.casket:after {
		top: 5px;   left: 26px;
		width: 9px; height: 6px;
		background: #012135;
		border-radius: 50%;
		box-shadow: 0 17px 0 0 #012135;
	}
.pineapple {
	top: 156px;   left: -330px;
	width: 86px; height: 64px;
	box-sizing: border-box;
	border-top: 13px dashed #233B37;
	border-left: 17px dashed #233B37;
	border-radius: 100% 0 0 0;
	transform: rotate(45deg);
}
	.pineapple:before {
		top: -2px;   left: -2px;
		width: 71px; height: 53px;
		background: #233B37;
		border-radius: 100% 0 0 0;
	}
	.pineapple:after {
		top: 34px;   left: 45px;
		width: 56px; height: 40px;
		background: #222131;
		border-radius: 10px 10px 10px 10px / 23px 23px 23px 23px;
		transform: rotate(-45deg);
	}
.berries {
	top: 299px; left: -359px;
	width: 17px; height: 13px;
	border-radius: 50%;
	background: #52383C;
	box-shadow: 10px 11px 0 0 #52383C, -5px 8px 0 0 #52383C, -52px 8px 0 0 #52383C, -42px 8px 0 0 #52383C;
}
.bat-1 {
	top: -64px;  left: 255px;
	width: 48px; height: 74px;
	background: #182129;
	border-radius: 20px 20px 0 0;
	transform-origin: top center;
	animation: bat 3s linear infinite;
	z-index: 1;
}
	.bat-1:before {
		top: 0px;    left: -11px;
		width: 45px; height: 50px;
		background: #182129;
		border-radius: 0 12px 8px 7px;
		transform: rotate(27deg);
	}
	.bat-1:after {
		top: 0px;    left: 9px;
		width: 45px; height: 50px;
		background: #182129;
		border-radius: 12px 0 7px 8px;
		transform: rotate(-27deg);
	}
	.bat-1 div {
		top: 74px; left: 0px;
		border-right: 15px solid transparent;
		border-top: 11px solid #182129;
	}
		.bat-1 div:before {
			top: -11px; left: 32px;
			border-left: 15px solid transparent;
			border-top: 11px solid #182129;
		}
		.bat-1 div:after {
			top: -34px; left: 9px;
			width: 9px; height: 6px;
			background: #726332;
			border-radius: 50%;
			box-shadow: 10px 0 0 0 #726332;
			animation: batEye 3s linear infinite;
		}
.bat-2 {
	top: -80px;  left: 348px;
	width: 48px; height: 74px;
	background: #182129;
	border-radius: 20px 20px 0 0;
	transform-origin: top center;
	animation: bat 3s linear infinite;
	animation-delay: -2s;
	z-index: 1;
}
	.bat-2:before {
		top: 0px;    left: -11px;
		width: 45px; height: 50px;
		background: #182129;
		border-radius: 0 12px 8px 7px;
		transform: rotate(27deg);
	}
	.bat-2:after {
		top: 0px;    left: 9px;
		width: 45px; height: 50px;
		background: #182129;
		border-radius: 12px 0 7px 8px;
		transform: rotate(-27deg);
	}
	.bat-2 div {
		top: 74px; left: 0px;
		border-right: 15px solid transparent;
		border-top: 11px solid #182129;
	}
		.bat-2 div:before {
			top: -11px; left: 32px;
			border-left: 15px solid transparent;
			border-top: 11px solid #182129;
		}
.besom {
	top: 143px;   left: 156px;
	width: 84px; height: 63px;
	border-radius: 2px 81%;
	background: #3B4A3E;
	transform: rotate(21deg);
	transform-origin: -13px -55px;
	z-index: 101;
}
	.besom:before {
		top: -34px; left: -35px;
		width: 15px;
		border-left: 11px solid transparent;
		border-right: 11px solid transparent;
		border-top: 42px solid #30403F;
		transform: rotate(-40deg);
	}
	@supports (-webkit-box-reflect: left) {
		.besom:after {
			top: -16px;  left: 15px;
			width: 48px; height: 35px;
			background: #30403F;
			border-radius: 0 90%;
			transform: rotate(-40deg);
			-webkit-box-reflect: left 3px;
		}
	}
	.besom .rope {
		top: -95px; left: -13px;
		width: 13px; height: 98px;
		border-radius: 4px;
		background: #464230;
		z-index: 1000;
		transform: rotate(-21deg);
	}
		.besom .rope:before {
			top: 95px;   left: -22px;
			width: 35px; height: 8px;
			background: #464230;
			border-radius: 4px;
			transform: rotate(-26deg);
		}
	.moth-rope {
		top: 0px;   left: 549px;
		width: 9px; height: 42px;
		border-radius: 0 0 4px 4px;
		background: #393931;
		box-shadow: 14px 0 0 0 #393931, 27px 0 0 0 #393931;
	}
		.moth-rope:before {
			top: 39px;    left: 2px;
			width: 326px; height: 48px;
			border-radius: 0 0 120px 120px;
			border-left: 9px solid #312E36;
			border-bottom: 6px solid #312E36;
			border-right: 9px solid #312E36;
		}
		.moth-rope:after {
			top: -60px;  left: 246px;
			width: 143px; height: 106px;
			box-sizing: border-box;
			background: radial-gradient(#32323C 20%, transparent 21%, transparent 50%, #32323C 51%);
			border-radius: 50%;
		}
.moth {
	top: 69px;  left: 734px;
	width: 17px; height: 55px;
	background: #263449;
	border-radius: 4px;
	transform-origin: 4px 4px;
	transform: rotate(30deg);
	animation: moth 1.5s infinite;
}
	.moth:before {
		top: 56px;   left: 11px;
		width: 26px; height: 19px;
		background: #304252;
		border-radius: 50%;
		box-shadow: -15px 0 0 0 #304252, -8px -3px 0 3px #263449;
	}
	.moth__wings:before {
		top: 2px; left: -9px;
		border-left: 26px solid transparent;
		border-right: 26px solid transparent;
		border-top: 50px solid #1C596C;
		border-radius: 20px 20px 0 0;
		transform: rotate(40deg);
		transform-origin: bottom center;
		animation: mothWingRight 1.5s infinite;
	}
	.moth__wings:after {
		top: 2px; left: -30px;
		border-left: 26px solid transparent;
		border-right: 26px solid transparent;
		border-top: 50px solid #1C596C;
		border-radius: 20px 20px 0 0;
		transform: rotate(-43deg);
		transform-origin: bottom center;
		animation: mothWingLeft 1.5s infinite;
}
.alchemist {
	top: 184px;   left: 564px;
	width: 494px; height: 782px;
	z-index: 1;
}
	.alchemist__arm-r {
		top: 412px;  left: 312px;
		width: 39px; height: 129px;
		border-radius: 12px;
		transform-origin: 12px 12px;
		transform: rotate(-38deg);
		background: #9c735a;
		animation: alchemistRightArm 30s linear infinite;
	}
		.alchemist__arm-r:before {
			top: 90px;   left: 0px;
			width: 39px; height: 135px;
			border-radius: 12px;
			transform-origin: 12px 12px;
			transform: rotate(36deg);
			background: #9C735A;
			animation: alchemistRightForearm 30s linear infinite;
		}
	.alchemist__arm-l {
		top: 412px;  left: 167px;
		width: 39px; height: 129px;
		border-radius: 12px;
		transform-origin: 12px 12px;
		transform: rotate(38deg);
		background: #9C735A;
		animation: alchemistLeftArm 30s linear infinite;
	}
		.alchemist__arm-l:before {
			top: 90px;   left: 0px;
			width: 39px; height: 135px;
			border-radius: 12px;
			transform-origin: 12px 12px;
			transform: rotate(-22deg);
			background: #9C735A;
			animation: alchemistLeftForearm 30s linear infinite;
		}
	.alchemist__leg-r {
		top: 644px;  left: 287px;
		width: 43px; height: 87px;
		background: linear-gradient(to bottom, #424241 88%, #312E36 88%);
	}
		.alchemist__leg-r:before {
			top: 87px;   left: -19px;
			width: 84px; height: 29px;
			border-radius: 20px 20px 0 0;
			background: linear-gradient(to bottom, #464230 70%, #5A5A4A 70%);
		}
	.alchemist__leg-l {
		top: 644px;  left: 164px;
		width: 43px; height: 87px;
		background: linear-gradient(to bottom, #424241 80%, #312E36 80%);
		transform-origin: top center;
		animation: alchemistLeftLeg 30s linear infinite;
	}
		.alchemist__leg-l:before {
			top: 87px;   left: -19px;
			width: 84px; height: 29px;
			border-radius: 20px 20px 0 0;
			background: linear-gradient(to bottom, #464230 70%, #5A5A4A 70%);
		}
	.alchemist__beard {
		top: 177px;  left: 97px;
		width: 16px; height: 159px;
		border-radius: 0 0 11px 30px;
		border-left: 68px solid #7B4A31;
		border-bottom: 18px solid #7B4A31;
		animation: alchemistBeard 30s linear infinite;
	}
		.alchemist__beard:before {
			top: 0;      left: -151px;
			width: 16px; height: 159px;
			border-radius: 0 0 30px 11px;
			border-right: 68px solid #845239;
			border-bottom: 18px solid #845239;
		}
	.alchemist__ear-r {
		top: 31px;   left: 156px;
		width: 108px; height: 55px;
		border-radius: 0 0 40px 40px;
		background: #FFCEA5;
		z-index: -1;
		transform: rotate(-46deg);
		animation: alchemistRightEar 30s linear infinite;
	}
		.alchemist__ear-r:before {
			top: 11px;    left: 45px;
			width: 24px; height: 32px;
			background: #CF9574;
			border-radius: 7px;
			transform: rotate(46deg);
		}
	.alchemist__ear-l {
		top: 31px;   left: -68px;
		width: 108px; height: 55px;
		border-radius: 0 0 40px 40px;
		background: #FFCEA5;
		z-index: -1;
		transform: rotate(46deg);
		animation: alchemistLeftEar 30s linear infinite;
	}
		.alchemist__ear-l:before {
			top: 11px;    left: 39px;
			width: 24px; height: 32px;
			background: #CF9574;
			border-radius: 7px;
			transform: rotate(-46deg);
		}
	.alchemist__eye-r {
		top: 81px; left: 101px;
		z-index: 1;
		animation: alchemistRightEye 30s linear infinite;
	}
		.alchemist__eye-r:before {
			top: -61px;  left: 3px;
			width: 92px; height: 48px;
			background: linear-gradient(to bottom, transparent 21%, #FFFFCE 21%);
			border-radius: 0 0 30px 30px;
			transform: rotate(-43deg);
			animation: alchemistRightBrow 30s linear infinite;
		}
		.alchemist__eye-r:after {
			top: -6px;   left: 11px;
			width: 35px; height: 14px;
			background: #313139;
			border-radius: 5px;
		}
	.alchemist__eye-l {
		top: 81px; left: 35px;
		z-index: 1;
		animation: alchemistLeftEye 30s linear infinite;
	}
		.alchemist__eye-l:before {
			top: -61px;  left: -35px;
			width: 92px; height: 48px;
			background: linear-gradient(to bottom, transparent 21%, #FFFFCE 21%);
			border-radius: 0 0 30px 30px;
			transform: rotate(43deg);
			animation: alchemistLeftBrow 30s linear infinite;
		}
		.alchemist__eye-l:after {
			top: -18px;  left: 6px;
			width: 26px; height: 26px;
			border-radius: 50%;
			border: 6px solid #313139;
			background: linear-gradient(to bottom, #3193AE 50%, #29F2F2 50%);
			z-index: 1;
		}
	.alchemist__head {
		top: 198px;   left: 151px;
		width: 193px; height: 177px;
		border-radius: 30px 30px 24px 24px;
		background: #FFCEA5;
		transform-origin: bottom center;
		animation: alchemistHead 30s linear infinite;
	}
		.alchemist__head:before {
			top: 95px;   left: 29px;
			width: 48px; height: 48px;
			border-radius: 50%;
			box-shadow: 80px 0 0 0 #F7857C;
			background: #F7857C;
			animation: alchemistСheeks 30s linear infinite;
		}
		.alchemist__head:after {
			top: 87px; left: 32px;
			border-left: 64px solid transparent;
			border-right: 64px solid transparent;
			border-top: 68px solid #FFCEA5;
			animation: alchemistNose 30s linear infinite;
		}
	.alchemist__mustache {
		top: 156px; left: 68px;
		animation: alchemistMustache 30s linear infinite;
	}
		.alchemist__mustache:before {
            top: -29px;
            left: -104px;
            width: 168px;
            height: 105px;
            border-radius: 90px 62px 0 0;
            background: linear-gradient(180deg, #FFFFCE 50%, transparent 50%);
            transform-origin: 98px 41px;
            transform: rotate(-46deg);
		}
		.alchemist__mustache:after {
			top: -46px;
            left: -4px;
            width: 163px;
            height: 99px;
            border-radius: 62px 90px 0 0;
            background: linear-gradient(180deg, #ffffce 50%, transparent 50%);
            transform-origin: 36px 41px;
            transform: rotate(46deg);
		}
	.alchemist__hat {
		top: 193px;  left: 309px;
		width: 158px; height: 60px;
		border-radius: 8px 0 100px 0;
		background: #F78C42;
		animation: alchemistHat 30s linear infinite;
	}
		.alchemist__hat:before {
			top: 52px;   left: 24px;
			width: 64px; height: 64px;
			border-radius: 0 0 40px 0;
			background: #F78C42;
			transform: rotate(40deg);
		}
	.alchemist__hat-1 {
		top: 0px;     left: -274px;
		width: 161px; height: 63px;
		border-radius: 0 0 0 40px;
		background: #F78C42;
		box-shadow: inset 11px 11px 0 0 #F7E773;
	}
		.alchemist__hat-1:before {
			top: 50px;   left: 64px;
			width: 64px; height: 63px;
			border-radius: 0 0 0 40px;
			background: #F7E773;
			transform: rotate(-45deg);
		}
		.alchemist__hat-1:after {
			top: -69px;   left: -26px;
			width: 253px; height: 101px;
			border-radius: 0 0 0 100px;
			background: #F78C42;
		}
	.alchemist__hat-2 {
		top: -142px;  left: -309px;
		width: 37px; height: 45px;
		border-radius: 20px 0 0;
		background: #DE7352;
	}
		.alchemist__hat-2:before {
			top: 37px;    left: 0px;
			width: 262px; height: 114px;
			border-radius: 0 0 0 70px;
			background: linear-gradient(193deg, transparent 38%, #DE7352 20%);
		}
		.alchemist__hat-2:after {
			top: 32px;   left: 0;
			width: 129px; height: 40px;
			border-radius: 0 0 0 30px;
			box-shadow: inset 57px 0 0 0 #DE7352;
		}
	.alchemist__hat-3 {
		top: -135px;  left: -177px;
		width: 119px; height: 113px;
		border-radius: 32px 0 0 0;
		background: #DE7352;
	}
		.alchemist__hat-3:before {
			top: 35px;    left: 169px;
			width: 190px; height: 134px;
			border-radius: 0 0 77px 0;
			background: #F78C42;
		}
		.alchemist__hat-3:after {
			top: 26px;    left: 167px;
			width: 193px; height: 122px;
			border-radius: 16px 0 90px 0;
			background: #BD6B42;
		}
	.alchemist__hat-4 {
		top: -161px; left: -52px;
		width: 52px; height: 166px;
		border-radius: 0 29px 0 0;
		background: #BD6B42;
	}
		.alchemist__hat-4:before {
			top: 26px;   left: 85px;
			width: 23px; height: 27px;
			background: #BD6B42;
			border-radius: 14px 0 0 0;
			-webkit-box-reflect: right 11px;
		}
		.alchemist__hat-4:after {
			top: 10px;    left: 195px;
			width: 40px; height: 42px;
			background: #BD6B42;
			border-radius: 0 24px 0 0;
		}
	.alchemist__hat-5 {
		top: -92px; left: -97px;
		border-right: 87px solid transparent;
		border-bottom: 71px solid #DE7352;
	}
		.alchemist__hat-5:before {
			top: 0px; left: -24px;
			border-right: 87px solid transparent;
			border-bottom: 71px solid #DE7352;
		}
		.alchemist__hat-5:after {
			top: 40px;   left: -108px;
			width: 48px; height: 26px;
			border-radius: 0 0 30px 30px;
			background: #BD6B42;
		}
	.alchemist__hat-6 {
		top: -109px;  left: -272px;
		width: 42px; height: 21px;
		border-radius: 0 0 20px 20px;
		background: #B04D43;
	}
		.alchemist__hat-6:before {
			top: -21px;  left: 23px;
			width: 32px; height: 32px;
			border-radius: 0 70%;
			background: #F6AC43;
		}
		.alchemist__hat-6:after {
			top: 39px;  left: -10px;
			width: 11px; height: 11px;
			border-radius: 50%;
			background: #B04D43;
			box-shadow: 12px 0 #B04D43, 24px 0 #B04D43, 6px 9px #B04D43, 18px 9px #B04D43, 29px 22px #B04D43, 53px 39px #3B4358, 67px 39px #3B4358;
		}
	.alchemist__hat-7 {
		top: -43px;  left: 129px;
		width: 40px; height: 40px;
		border-radius: 0 80%;
		background: #F6AC43;
	}
		.alchemist__hat-7:before {
			top: 3px;    left: -66px;
			width: 39px; height: 39px;
			border-radius: 80% 0;
			background: #505C42;
			box-shadow: -398px 38px #8DA422;
		}
		.alchemist__hat-7:after {
			top: -47px; left: -82px;
			width: 13px; height: 13px;
			border-radius: 50%;
			background: #F1C260;
			box-shadow: 13px 0 #F1C260;
		}
	.alchemist__forelock {
		top: -52px;  left: -95px;
		width: 47px; height: 56px;
		border-radius: 0 90% 0 0;
		background: #7B4A31;
		z-index: 1;
	}
		.alchemist__forelock:before {
			top: -48px;  left: 34px;
			width: 58px; height: 105px;
			border-radius: 0 54px 40px 0;
			background: #7B4A31;
		}
		.alchemist__forelock:after {
			top: 40px;   left: 5px;
			width: 24px; height: 39px;
			border-radius: 10px 0 0 20px;
			background: #7B4A31;
			transform-origin: right top;
			transform: rotate(-42deg);
		}
	.alchemist__cat {
		top: -184px; left: -119px;
		width: 90px; height: 145px;
		border-radius: 30px;
		background: #3B4358;
		animation: cat 30s linear infinite;
	}
		.alchemist__cat:before {
			top: 103px;   left: -29px;
			width: 48px; height: 27px;
			border-radius: 0 0 0 20px;
			background: #3B4358;
			animation: catHand 30s linear infinite;
		}
		.alchemist__cat:after {
			top: 24px;   left: 19px;
			width: 16px; height: 13px;
			border-radius: 100%;
			background: #F1C260;
			box-shadow: 23px 0 #F1C260;
			animation: catEyes 30s linear infinite;
		}
	.alchemist__cat-face {
		top: 43px; left: 37px;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-top: 10px solid #1A252F;
	}
		.alchemist__cat-face:before {
			top: -64px;  left: -32px;
			width: 19px; height: 27px;
			border-radius: 10px 2px 6px 0;
			background: #3B4358;
		}
		.alchemist__cat-face:after {
			top: -64px;  left: 14px;
			width: 19px; height: 27px;
			border-radius: 2px 10px 0 6px;
			background: #3B4358;
			transform-origin: bottom left;
			transform: rotate(90deg) translate(-6px, -6px);
		}
	.alchemist__cat-tail {
		top: -188px; left: -187px;
		width: 35px; height: 92px;
		border-radius: 0 20px 0 13px;
		background: linear-gradient(to bottom, #445A66 36%, #3B4358 36%);
	}
	.alchemist__coat-1 {
		top: 454px;   left: 142px;
		width: 256px; height: 283px;
		border-radius: 10px 10px 20px 20px;
		background: #263449;
	}
		.alchemist__coat-1:before {
			top: 0px;    left: -111px;
			width: 111px; height: 283px;
			border-radius: 60px 0 16px 13px;
			background: #263449;
			transform-origin: bottom left;
			transform: skew(-7deg);
			animation: alchemistLeftCloak 30s linear infinite;
		}
		.alchemist__coat-1:after {
			top: 0px;    left: 259px;
			width: 76px; height: 283px;
			border-radius: 0 60px 17px 27px;
			background: #263449;
			transform-origin: bottom left;
			transform: skew(10deg);
			animation: alchemistRightCloak 30s linear infinite;
		}
	.alchemist__coat-2 {
		top: 346px;  left: 114px;
		width: 113px; height: 97px;
		border-radius: 0 0 10px 100px;
		background: #304252;
		transform-origin: bottom right;
		transform: rotate(-45deg);
		animation: alchemistLeftShoulder 30s linear infinite;
	}
		.alchemist__coat-2:before {
			top: -21px;  left: -66px;
			width: 118px; height: 60px;
			background: #304252;
			transform-origin: bottom left;
			transform: rotate(21deg) skew(-38deg);
		}
		.alchemist__coat-2:after {
			top: 0px;    right: -113px;
			width: 113px; height: 100%;
			background: #304252;
		}
	.alchemist__coat-3 {
		top: 327px;  left: 264px;
		width: 113px; height: 97px;
		border-radius: 0 0 100px 10px;
		background: #304252;
		transform-origin: bottom left;
		transform: rotate(42deg);
		animation: alchemistRightShoulder 30s linear infinite;
	}
		.alchemist__coat-3:before {
			top: -24px;  left: 50px;
			width: 150px; height: 81px;
			background: #304252;
			transform-origin: bottom right;
			transform: rotate(-19deg) skew(38deg);
		}
		.alchemist__coat-3:after {
			top: 0px;    left: -113px;
			width: 113px; height: 100%;
			background: #304252;
		}
	.alchemist__body {
		top: 370px;   left: 140px;
		width: 222px; height: 304px;
		border-radius: 50% 50% 0 0 / 100% 100% 0 0;
		background: #424241;
	}
.chair {
	top: 943px;   left: 704px;
	width: 337px; height: 32px;
	background: #564239;
}
.pedal {
	top: 910px; left: 577px;
	width: 13px; height: 60px;
	border-radius: 3px;
	background: #524342;
	transform-origin: bottom center;
	transform: rotate(77deg);
	animation: alchemistPedal 30s linear infinite;
}
	.pedal > div {
		width: 13px; height: 72px;
		border-radius: 3px;
		background: #524342;
		transform-origin: 3px 3px;
		transform: rotate(44deg);
		animation: alchemistPedal-1 30s linear infinite;
	}
		.pedal > div > div {
			top: 63px;  left: 0px;
			width: 13px; height: 43px;
			border-radius: 3px;
			background: #524342;
			transform-origin: 3px 3px;
			transform: rotate(134deg);
			animation: alchemistPedal-2 30s linear infinite;
		}
			.pedal > div > div:before {
				bottom: -10px; left: -37px;
				width: 104px;  height: 21px;
				border-radius: 10px;
				background: #433532;
				transform-origin: center center;
				transform: rotate(-64deg);
				animation: alchemistPedal-3 30s linear infinite;
			}
.table {
	top: 799px;   left: 0px;
	width: 1728px; height: 35px;
	background: #564239;
	box-shadow: 0 25px 0 5px #312E36;
	z-index: 1;
}
	.table:before {
		top: 0;       left: 1236px;
		height: 100%; width: 235px;
		border-radius: 50px;
		background: #7A5939;
		box-shadow: -267px 0 0 0 #9C7B31, -187px 0 0 0 #9C7B31,
					-507px 0 0 0 #7A5939, -450px 0 0 0 #7A5939, -310px 0 0 0 #7A5939, -144px 0 0 0 #7A5939;
	}
.cage {
	top: 813px;  left: 1272px;
	width: 156px; height: 193px;
	box-sizing: border-box;
	border: 7px solid #32323C;
	border-radius: 100px 64px 0 0;
	-webkit-box-reflect: right -52px;
	z-index: 1;
}
	.cage:before {
		top: -11px;  left: 76px;
		width: 15px; height: 161px;
		background: #383949;
		box-shadow: 0 -32px 0 -1px #32323C;
	}
	.cage:after {
		top: -23px;  left: 71px;
		height: 11px; width: 28px;
		background: #3B4358;
		box-shadow: -8px 77px 0 0 #3B4358, -16px 55px 0 0 #3B4358, -28px 55px 0 0 #3B4358, -40px 55px 0 0 #3B4358, -45px 55px 0 0 #3B4358;
	}
.basket {
	left: 1398px;  top: 855px;
	width: 283px; height: 161px;
	z-index: 1;
}
	.basket:before {
		left: 138px;  top: 19px;
		width: 65px; height: 48px;
		background: #433532;
		border-radius: 80% 0;
		box-shadow: -96px 42px 0 0 #433532;
		transform: rotate(29deg);
	}
	.basket:after {
		top: 0px;   left: 130px;
		width: 19px; height: 129px;
		background: #524342;
		border-radius: 10px;
	}
	.basket div {
		top: 16px;   left: 78px;
		width: 56px; height: 42px;
		background: #30403F;
		border-radius: 70% 0;
		transform: rotate(-80deg);
	}
		.basket div:before {
			top: 3px;     left: -201px;
			width: 281px; height: 113px;
			box-sizing: border-box;
			background: #464230;
			border-radius: 0 0 100px 100px;
			border-top: 16px solid #3A3031;
			transform: rotate(80deg);
		}
		.basket div:after {
				top: 82px;   left: 39px;
				width: 32px; height: 24px;
				background: #3C5843;
				border-radius: 14% 80%;
				transform: rotate(-10deg);
				box-shadow: -28px -74px 0 -2px #3C5843, -25px -97px 0 2px #3C5843;
		}
.bottle-1 {
	top: -280px; left: 1696px;
	width: 43px; height: 280px;
	background: #1C596C;
}
	.bottle-1:before {
		left: -50px; top: 43px;
		width: 50px; height: 237px;
		background: #1C596C;
		border-radius: 23px 0 0 8px / 40px 0 0 8px;
	}
	.bottle-1:after {
		top: -16px;  left: -11px;
		width: 45px; height: 19px;
		border-radius: 4px;
		background: #519CBC;
	}
	.bottle-1 div:nth-child(1) {
		top: 76px;   left: 11px;
		width: 65px; height: 106px;
		border-radius: 100% 0 0 100%;
		background: #3C5843;
	}
		.bottle-1 div:nth-child(1):before {
			top: 47px;   left: -26px;
			width: 28px; height: 66px;
			border-radius: 50% 50% 0 0 / 100% 100% 0 0;
			background: #5A844F;
			transform: rotate(-19deg);
		}
		.bottle-1 div:nth-child(1):after {
			top: 103px;   left: -43px;
			width: 86px; height: 87px;
			border-radius: 15px 0 0 4px;
			background: #564239;
		}
	.bottle-1 div:nth-child(2) {
		top: 76px;   left: -32px;
		width: 56px; height: 71px;
		background: #519cbc6e;
		border-radius: 23px 10px 10px 25px;
	}
		.bottle-1 div:nth-child(2):before {
			top: 11px;    left: 15px;
			width: 35px; height: 24px;
			border-radius: 8px 10px 12px 12px;
			background: #519CBC;
		}
		.bottle-1 div:nth-child(2):after {
			top: 132px;   left: 15px;
			width: 24px; height: 18px;
			border-radius: 50%;
			background: #8F988E;
			box-shadow: 20px -15px 0 0 #3C313C, 13px -23px 0 -1px #3C313C;
		}
.bottle-2 {
	top: -158px;  left: 1499px;
	width: 82px; height: 19px;
	border-radius: 12px;
	background: #BC8740;
	box-shadow: inset -11px -5px 0 0 #965D3F;
}
	.bottle-2:before {
		top: 19px;   left: -9px;
		width: 99px; height: 13px;
		border-radius: 4px;
		background: #C7DECB;
		box-shadow: inset -28px 0px 0 0 #8CA59C;
	}
	.bottle-2:after {
		top: 32px;   left: 0px;
		width: 84px; height: 10px;
		background: #597B8B;
		box-shadow: 0 4px 0 -2px #9C735A;
	}
	.bottle-2 > div:nth-child(1) {
		top: 42px;   left: -60px;
		width: 210px; height: 116px;
		box-sizing: border-box;
		border: 6px solid #8CBC9B;
		border-radius: 32px 32px 15px 15px;
		background: #8CBC9B;
		overflow: hidden;
	}
		.bottle-2 > div:nth-child(1):after {
			top: 13px;    left: 99px;
			width: 69px; height: 64px;
			border-radius: 16px 13px 12px 12px;
			background: #ffffff42;
		}
	.bottle-2__dude-1 {
		top: 16px;   left: 76px;
		width: 50px; height: 29px;
		border-radius: 10px;
		background: #1A252F;
		transform: rotate(8deg);
		animation: bottle2Dude1 3s ease infinite;
		animation-delay: -1.2s;
	}
		.bottle-2__dude-1:before {
			top: 6px;   left: 9px;
			width: 15px; height: 11px;
			border-radius: 50%;
			background: #F1C260;
			box-shadow: 18px 0px 0 0 #F1C260;
		}
	.bottle-2__dude-2 {
		top: 66px;   left: 9px;
		width: 41px; height: 24px;
		border-radius: 10px;
		background: #1A252F;
		transform: rotate(8deg);
		animation: bottle2Dude2 3s ease infinite;
		animation-delay: -2.3s;
	}
		.bottle-2__dude-2:before {
			top: 6px;   left: 9px;
			width: 11px; height: 8px;
			border-radius: 50%;
			background: #f1c260;
			box-shadow: 6px 0 0 0 #f1c260;
		}
	.bottle-2__dude-3 {
		top: 63px;   left: 112px;
		width: 37px; height: 23px;
		border-radius: 10px;
		background: #1a252f;
		transform: rotate(-15deg);
		animation: bottle2Dude3 3s ease infinite;
		animation-delay: -0.2s;
	}
		.bottle-2__dude-3:before {
			top: 6px;   left: 6px;
			width: 11px; height: 8px;
			border-radius: 50%;
			background: #F1C260;
			box-shadow: 6px 0 0 0 #f1c260;
		}
.bottle-3 {
	top: -213px; left: 1283px;
	width: 134px; height: 21px;
	border-radius: 8px;
	background: #8CBC9B;
	box-shadow: inset -35px 0 0 0 #2E759E;
}
	.bottle-3:before {
		top: 21px;   left: 17px;
		width: 99px; height: 10px;
		background: #074770;
	}
	.bottle-3:after {
		top: 52px;   left: -11px;
		width: 37px; height: 29px;
		border-radius: 14px 9px 12px 12px;
		background: #ffffff42;
	}
	.bottle-3 > div:nth-child(1) {
		top: 31px;   left: -35px;
		width: 203px; height: 182px;
		box-sizing: border-box;
		border: 7px solid #1C596C;
		border-radius: 20px 20px 10px 10px;
		background: #1C596C;
		overflow: hidden;
	}
		.bottle-3 > div:nth-child(1):before {
			top: 148px;   left: 28px;
			width: 110px; height: 11px;
			border-radius: 10px 10px 0 0;
			background: #599B8B;
		}
	.bottle-3__dude-1 {
		top: 10px;    left: 65px;
		width: 117px; height: 87px;
		border-radius: 50%;
		background: #42ADBD90;
		animation: bottle3Dude1 5s ease -2s infinite;
	}
		.bottle-3__dude-1:before {
			top: 37px;  left: 45px;
			width: 19px; height: 14px;
			border-radius: 50%;
			background: #68FBE5;
			box-shadow: 12px 6px 0 -2px #68FBE5;
		}
		.bottle-3__dude-1:after {
			top: 34px;  left: 54px;
			width: 17px; height: 13px;
			border-radius: 90% 0;
			background: #1A252F;
			transform: rotate(-57deg);
			-webkit-box-reflect: left 0px;
		}
	.bottle-3__dude-2 {
		top: 16px;   left: -26px;
		width: 117px; height: 87px;
		border-radius: 50%;
		background: #42ADBD90;
		transform: rotate(20deg);
		animation: bottle3Dude2 5s ease -1s infinite;
	}
		.bottle-3__dude-2:before {
			top: 37px;  left: 45px;
			width: 19px; height: 14px;
			border-radius: 50%;
			background: #68FBE5;
			box-shadow: 12px 6px 0 -2px #68FBE5;
		}
		.bottle-3__dude-2:after {
			top: 34px;  left: 54px;
			width: 17px; height: 13px;
			border-radius: 90% 0;
			background: #1A252F;
			transform: rotate(-57deg);
			-webkit-box-reflect: left 0px;
		}
	.bottle-3__dude-3 {
		top: 66px;   left: 15px;
		width: 117px; height: 87px;
		border-radius: 50%;
		background: #42ADBD90;
		transform: rotate(-40deg);
		animation: bottle3Dude3 5s ease infinite;
	}
		.bottle-3__dude-3:before {
			top: 37px;  left: 45px;
			width: 19px; height: 14px;
			border-radius: 50%;
			background: #68FBE5;
			box-shadow: 12px 6px 0 -2px #68FBE5;
		}
		.bottle-3__dude-3:after {
			top: 34px;  left: 54px;
			width: 17px; height: 13px;
			border-radius: 90% 0;
			background: #1A252F;
			transform: rotate(-57deg);
			-webkit-box-reflect: left 0px;
		}
	.bottle-3 .dust-1 {
		top: -16px; left: 97px;
		width: 15px; height: 11px;
		background: #2283c7;
		animation: bottle3Dust1 5s linear -1s infinite;
	}
	.bottle-3 .dust-2 {
		top: -19px; left: 86px;
		width: 11px; height: 8px;
		background: #2283c7;
		animation: bottle3Dust2 5s linear -2s infinite;
	}
	.bottle-3 .dust-3 {
		top: -19px; left: 43px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust3 5s linear -3s infinite;
	}
	.bottle-3 .dust-4 {
		top: -45px; left: 43px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust4 5s linear -4s infinite;
	}
	.bottle-3 .dust-5 {
		top: -35px; left: 117px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust5 5s linear -1.4s infinite;
	}
	.bottle-3 .dust-6 {
		top: -68px; left: 73px;
		width: 11px; height: 8px;
		background: #2283c7;
		animation: bottle3Dust6 5s linear -2.1s infinite;
	}
	.bottle-3 .dust-7 {
		top: -100px; left: 73px;
		width: 11px; height: 8px;
		background: #2283c7;
		animation: bottle3Dust7 5s linear -4.1s infinite;
	}
	.bottle-3 .dust-8 {
		top: -100px; left: 4px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust8 5s linear -3.1s infinite;
	}
	.bottle-3 .dust-9 {
		top: -93px; left: 95px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust9 5s linear -2.6s infinite;
	}
	.bottle-3 .dust-10 {
		top: -119px; left: 112px;
		width: 13px; height: 10px;
		background: #2283c7;
		animation: bottle3Dust10 5s linear infinite;
	}
.mushroom-3 {
	top: -66px;  left: 1205px;
	width: 39px; height: 45px;
	border-style: solid;
	border-width: 0 8px 8px 8px;
	border-color: #D6E7CA;
	border-radius: 0 0 16px 16px;
}
	.mushroom-3:before {
		top: 55px;   left: 4px;
		width: 30px; height: 11px;
		background: #D6E7CA;
	}
	.mushroom-3:after {
		top: -37px; left: -17px;
		width: 17px; height: 40px;
		background: #D6E7CA;
	}
	.mushroom-3 > div {
		top: 6px;    left: -48px;
		width: 22px; height: 19px;
		border-left: 17px solid #D6E7CA;
		border-bottom: 13px solid #D6E7CA;
		border-radius: 0 0 0 13px;
	}
		.mushroom-3 > div:before {
			top: -16px;  left: -43px;
			width: 63px; height: 16px;
			border-radius: 10px 10px 0 0;
			background: #964554;
			box-shadow: 42px 0 0 0 #F78C42, 15px -27px 0 0 #D66363;
			z-index: 1;
		}
.mushroom-4 {
	top: -32px;  left: 1123px;
	width: 73px; height: 26px;
	border-radius: 19px 19px 2px 2px;
	background: #699842;
}
	.mushroom-4:before {
		top: 26px;   left: 11px;
		width: 52px; height: 6px;
		border-radius: 0 0 10px 10px;
		background: #D6E7CA;
	}
.plants {
	top: -26px;  left: 63px;
	width: 188px; height: 26px;
	background: #464230;
}
	.plants:before {
		top: -171px; left: 9px;
		width: 17px;  height: 126px;
		background: #464230;
		transform-origin: bottom left;
		transform: skew(-17deg);
	}
	.plants:after {
		top: -161px; left: 17px;
		width: 22px; height: 52px;
		border-radius: 100% 100% 0 0;
		background: #464230;
		transform: rotate(-35deg);
	}
	.plants > div {
		top: -100px;  left: 32px;
		width: 86px; height: 100px;
		border-radius: 21px 20px 0 0;
		background: #216037;
	}
		.plants > div:before {
			top: -108px;  left: 39px;
			width: 48px; height: 35px;
			background: #216037;
			border-radius: 80% 0;
			transform-origin: bottom left;
			transform: rotate(0deg);
			animation: leaf 30s ease infinite;
		}
		.plants > div:after {
			top: 42px;   left: -58px;
			width: 58px; height: 58px;
			border-radius: 10px 10px 10px 10px;
			background: #233B37;
			box-shadow: 122px 10px 0 -6px #216037;
		}
.skulp {
	top: -84px;  left: 56px;
	width: 84px; height: 68px;
	border-radius: 17px 15px 17px 19px;
	background: linear-gradient(69deg, #8C9C7B 71%, #F7E773 72%);
	transform-origin: 10px bottom;
	animation: skulp 30s linear infinite;
}
	.skulp:before {
		top: 10px; left: 76px;
		height: 26px;
		border-top: 23px solid transparent;
		border-left: 48px solid #F7E773;
	}
	.skulp:after {
		top: 18px;   left: 37px;
		width: 41px; height: 31px;
		border-radius: 10px 13px 15px 10px;
		background: #313131;
	}
	.skulp > div:nth-child(1) {
		top: 34px;  left: 123px;
		width: 15px; height: 29px;
		border-radius: 0 10px 0 7px;
		background: #F7E773;
	}
		.skulp > div:nth-child(1):before {
			top: 18px;  left: -32px;
			width: 9px; height: 16px;
			border-radius: 4px;
			background: #F7E773;
			box-shadow: 8px 0 0 0 #F7E773, 18px 0 0 0 #F7E773;
		}
		.skulp > div:nth-child(1):after {
			top: 5px;   left: -9px;
			width: 13px; height: 10px;
			border-radius: 50%;
			background: #313131;
}
	.skulp > div:nth-child(2) {
		top: -72px;  left: -39px;
		width: 35px; height: 35px;
		border-left: 15px solid #8C9C7B;
		border-bottom: 11px solid #8C9C7B;
		border-radius: 0 0 0 29px;
	}
		.skulp > div:nth-child(2):before {
			top: 16px;  left: 24px;
			width: 17px; height: 39px;
			border-radius: 0 0 0 9px;
			background: #8C9C7B;
		}
		.skulp > div:nth-child(2):after {
			top: 42px;  left: 32px;
			width: 17px; height: 35px;
			background: #8C9C7B;
			transform: skew(20deg);
		}
	.pot:before {
		top: -182px; left: 199px;
		width: 210px; height: 93px;
		background: linear-gradient(-9deg, #726332 31%, #5A5A4A 32%);
		box-shadow: inset 7px -28px 0 0 rgba(0, 0, 0, 0.22);
		border-radius: 20px 23px 33px 30px;
		transform: rotate(10deg);
	}
	.pot:after {
		top: -122px;  left: 199px;
		width: 212px; height: 13px;
		border-radius: 4px;
		background: #DDAD31;
		box-shadow: inset 60px 0 0 0 #9C7B31;
	}
	.pot > div:nth-child(1) {
		top: -159px;  left: 341px;
		width: 32px; height: 26px;
		border-radius: 10px;
		background: #ffffff42;
	}
		.pot > div:nth-child(1):before {
			top: 58px;  left: -119px;
			width: 15px; height: 101px;
			background: #61542a;
			transform: skew(-10deg);
		}
		.pot > div:nth-child(1):after {
			top: 58px;  left: 32px;
			width: 15px; height: 101px;
			background: #61542a;
			transform: skew(10deg);
		}
	.pot > div:nth-child(2) {
		top: -198px; left: 227px;
		width: 143px;
		border-left: 17px solid transparent;
		border-right: 17px solid transparent;
		border-top: 19px solid #393939;
		box-shadow: 0 -6px 0 0 #589471;
		transform: rotate(10deg);
	}
		.pot > div:nth-child(2):before {
			top: 177px;  left: -22px;
			width: 125px; height: 10px;
			border-radius: 10px 10px 0 0;
			background: #29C88C;
			transform: rotate(-10deg);
		}
		.pot > div:nth-child(2):after {
			top: 161px;  left: 145px;
			width: 22px; height: 10px;
			border-radius: 10px 10px 0 0;
			background: #29C88C;
			transform: rotate(-10deg);
		}
		.pot > div:nth-child(3):before {
			top: -6px;  left: 251px;
			width: 13px; height: 50px;
			border-radius: 4px;
			background: #29C88C;
			transform-origin: top center;
		}
		.pot > div:nth-child(3):after {
			top: -6px;  left: 285px;
			width: 19px; height: 48px;
			border-radius: 4px;
			background: #29C88C;
			transform-origin: top center;
			animation: potLiquid2 30s linear infinite;
		}
	.pot > div:nth-child(4) {
		top: -206px; left: 324px;
		width: 17px; height: 11px;
		border-radius: 8px;
		background: #2ac88c;
	}
		.pot > div:nth-child(4):before {
			top: -3px; left: 26px;
			width: 22px; height: 29px;
			border-radius: 50%;
			background: #2ac88c;
			transform-origin: top center;
			animation: potPotion1 30s ease infinite;
		}
		.pot > div:nth-child(4):after {
			top: -2px; left: 45px;
			width: 17px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			transform-origin: top center;
			animation: potPotion2 30s ease infinite;
		}
	.pot > div:nth-child(5) {
		top: -211px; left: 294px;
		width: 17px; height: 13px;
		border-radius: 8px;
		background: #2ac88c;
	}
		.pot > div:nth-child(5):before {
			top: -11px; left: -35px;
			width: 13px; height: 31px;
			border-radius: 50%;
			background: #2ac88c;
			transform-origin: top center;
			animation: potPotion3 30s ease infinite;
		}
	.pot__drop {
		top: 0px;   left: 285px;
		width: 19px; height: 14px;
		border-radius: 50%;
		background: #29C88C;
		animation: potDrop 30s linear infinite;
	}
	.pot__bubble-1 {
		top: -132px;  left: 225px;
		width: 26px; height: 19px;
		border-radius: 50%;
		background: #29C88C;
		animation: potBubble1 30s linear infinite;
	}
	.pot__bubble-2 {
		top: -132px;  left: 255px;
		width: 26px; height: 19px;
		border-radius: 50%;
		background: #29C88C;
		animation: potBubble2 30s linear infinite;
	}
	.pot__bubble-3 {
		top: -129px;  left: 359px;
		width: 22px; height: 16px;
		border-radius: 50%;
		background: #29C88C;
		animation: potBubble3 30s linear infinite;
	}
	.bottle-4 {
		top: -87px;  left: 406px;
		width: 82px; height: 87px;
		border-radius: 5px;
		background: #8CC673;
		animation: bottle4 3s infinite;
	}
		.bottle-4:before {
			top: -16px;  left: 4px;
			width: 71px; height: 16px;
			border-radius: 6px;
			background: #BC8740;
		}
		.bottle-4:after {
			top: -3px;   left: 13px;
			width: 56px; height: 5px;
			background: #424241;
			box-shadow: 0 4px 0 1px #7B5A21;
		}
		.bottle-4__dude {
			top: 50px;   left: 22px;
			width: 39px; height: 24px;
			border-radius: 3px;
			background: #41253B;
		}
			.bottle-4__dude:before {
				top: 24px;  left: 0px;
				width: 17px; height: 6px;
				border-radius: 3px 0 0 0;
				background: #964554;
				-webkit-box-reflect: right 2px;
			}
		.bottle-4__dude-head {
			top: -19px;  left: -4px;
			width: 48px; height: 34px;
			transform-origin: bottom center;
			animation: bottle4DudeHead 3s infinite;
		}
			.bottle-4__dude-head:before {
				top: 10px;   left: 9px;
				width: 13px; height: 10px;
				border-radius: 50%;
				background: #313139;
				-webkit-box-reflect: right 3px;
				z-index: 1;
			}
			.bottle-4__dude-head:after {
				top: 0px;    left: 0px;
				width: 48px; height: 34px;
				border-radius: 9px;
				background: #964554;
			}
		.bottle-4__dude-hair-1 {
			top: -8px;  left: 13px;
			width: 17px; height: 13px;
			border-radius: 90% 0;
			background: #457E2D;
			transform-origin: bottom left;
			transform: rotate(-70deg);
			animation: bottle4DudeHeadHair1 3s infinite;
		}
		.bottle-4__dude-hair-2 {
			top: -11px;   left: 24px;
			width: 22px; height: 16px;
			border-radius: 90% 0;
			background: #457E2D;
			transform-origin: bottom left;
			transform: rotate(-45deg);
			animation: bottle4DudeHeadHair2 3s infinite;
		}
		.bottle-4__dude-hair-3 {
			top: -8px;  left: 32px;
			width: 17px; height: 13px;
			border-radius: 90% 0;
			background: #457E2D;
			transform-origin: bottom left;
			transform: rotate(-10deg);
			animation: bottle4DudeHeadHair3 3s infinite;
		}
.fire {
	position: absolute;
	left: 264px;
}
	.fire__item1 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f78c42;
		transform: rotate(-45deg);
		animation: fireItem1 4s ease -1s infinite;
	}
	.fire__item2 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f7e873;
		transform: rotate(-45deg);
		animation: fireItem2 4s ease -3.2s infinite;
	}
	.fire__item3 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f78c42;
		transform: rotate(-45deg);
		animation: fireItem3 4s ease -1.2s infinite;
	}
	.fire__item4 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f7e873;
		transform: rotate(-45deg);
		animation: fireItem4 4s ease -4.6s infinite;
	}
	.fire__item5 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f78c42;
		transform: rotate(-45deg);
		animation: fireItem5 4s ease -3.1s infinite;
	}
	.fire__item6 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f7e873;
		transform: rotate(-45deg);
		animation: fireItem4 4s ease -1.7s infinite;
	}
	.fire__item7 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f78c42;
		transform: rotate(-45deg);
		animation: fireItem5 4s ease -2.9s infinite;
	}
	.fire__item8 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f7e873;
		transform: rotate(-45deg);
		animation: fireItem4 4s ease -3.1s infinite;
	}
	.fire__item9 {
		top: -39px;  left: 17px;
		width: 28px; height: 21px;
		background: #f78c42;
		transform: rotate(-45deg);
		animation: fireItem5 4s ease -2.5s infinite;
	}
	.fire__item10 {
		left: 37px;  top: -34px;
		width: 28px; height: 21px;
		background: #f7e873;
		border-color: #f78c42;
		border-style: solid;
		border-width: 9px 4px 2px 2px;
		transform-origin: left bottom;
		transform: rotate(-45deg);
		animation: fireItem6 4s ease infinite;
	}
.plants-2 {
	top: -187px;  left: 337px;
	width: 272px; height: 187px;
}
	.plants-2 > div:nth-child(1) {
		top: 118px;   left: 17px;
		width: 93px; height: 69px;
		border-radius: 50%;
		background: #433532;
	}
		.plants-2 > div:nth-child(1):before {
			top: 6px;    left: 4px;
			width: 22px; height: 16px;
			background: #433532;
		}
		.plants-2 > div:nth-child(1):after {
			top: 26px;   left: -4px;
			width: 22px; height: 16px;
			background: #433532;
			transform: rotate(40deg);
		}
	.plants-2 > div:nth-child(2) {
		top: 82px;   left: -4px;
		width: 140px; height: 105px;
		border-radius: 0 100% 0 100%;
		background: #14775D;
		transform: rotate(63deg);
		transform-origin: bottom right;
		animation: plants2 30s linear infinite;
	}
	.plants-2 > div:nth-child(3) {
		top: 122px;   left: 69px;
		width: 86px; height: 64px;
		border-radius: 0 100% 0 100%;
		background: #38683E;
		transform: rotate(86deg);
		transform-origin: bottom right;
		animation: plants3 30s linear infinite;
	}
	.plants-2 > div:nth-child(4) {
		top: 138px;   left: 112px;
		width: 65px; height: 48px;
		border-radius: 0 100% 0 100%;
		background: #3C5843;
		transform: rotate(112deg);
		transform-origin: bottom right;
		animation: plants4 30s linear infinite;
	}
	.plants-2 > div:nth-child(5) {
		top: 100px;   left: 30px;
		width: 119px; height: 89px;
		border-radius: 0 100% 0 100%;
		background: #3C5843;
		transform: rotate(26deg);
		transform-origin: bottom right;
		animation: plants5 30s linear infinite;
	}
	.plants-2 > div:nth-child(6) {
		top: 34px;  left: 130px;
		width: 13px; height: 148px;
		background: #298B43;
		transform-origin: bottom center;
		animation: plants6 30s linear infinite;
	}
		.plants-2 > div:nth-child(6):before {
			top: -10px;   left: -37px;
			width: 39px; height: 29px;
			border-radius: 80% 0;
			background: #3C5843;
			-webkit-box-reflect: right;
			transform-origin: top right;
			transform: rotate(-12deg);
		}
		.plants-2 > div:nth-child(6):after {
			top: -31px; left: -26px;
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #DFA862;
			box-shadow: 18px -4px 0 0 #77354F, -2px 12px 0 0 #AD5261, 7px 8px 0 0 #AD5261, 17px 5px 0 0 #77354F;
		}
.nut {
	top: -31px;  left: 497px;
	width: 43px; height: 32px;
	border-radius: 60% 80% 0;
	background: linear-gradient(122deg, #3A3129 43%, #B79628 44%);
	transform: rotate(-12deg);
}
.staff {
	top: 931px;   left: 0px;
	width: 445px; height: 35px;
	border-radius: 0 0 16px 0;
	background: #433532;
	z-index: 1;
}
	.staff:before {
		top: -69px;  left: 117px;
		width: 91px; height: 69px;
		border-radius: 18px 18px 0 0;
		background: #564239;
	}
	.staff div:nth-child(1) {
		top: -74px;  left: 22px;
		width: 130px; height: 74px;
		border-radius: 29px 31px 0 0;
		background: #1A252F;
	}
		.staff div:nth-child(1):before {
			top: -37px;  left: 4px;
			width: 30px; height: 58px;
			border-radius: 18px 0 0 0;
			border-top: 11px solid #1A252F;
			border-left: 15px solid #1A252F;
		}
		.staff div:nth-child(1):after {
			top: -40px;  left: 48px;
			width: 39px; height: 45px;
			background: #1A252F;
		}
	.staff div:nth-child(2) {
		top: -126px;  left: 63px;
		width: 54px; height: 13px;
		border-radius: 4px;
		background: #212939;
		box-shadow: 0 28px 0 -2px #464230;
	}
		.staff div:nth-child(2):before {
			top: 61px; left: 19px;
			border-left: 17px solid transparent;
			border-right: 17px solid transparent;
			border-bottom: 13px solid #464230;
			box-shadow: 0 8px 0 0 #464230, 0 16px 0 0 #464230;
		}
		.staff div:nth-child(2):after {
			top: 47px;   left: 82px;
			width: 35px; height: 11px;
			background: #564239;
		}
	.staff div:nth-child(3) {
		top: -85px;  left: 138px;
		width: 48px; height: 8px;
		border-radius: 4px;
		background: #564239;
	}
		.staff div:nth-child(3):before {
			top: 61px;   left: 82px;
			width: 73px; height: 24px;
			border-radius: 22px 22px 0 0;
			background: #263449;
		}
		.staff div:nth-child(3):after {
			top: 53px;  left: 108px;
			width: 19px; height: 16px;
			background: #263449;
		}
	.staff div:nth-child(4) {
		top: -39px;  left: 242px;
		width: 30px; height: 6px;
		border-radius: 2px;
		background: #304252;
	}
		.staff div:nth-child(4):before {
			top: -5px;  left: 78px;
			width: 13px; height: 39px;
			background: #393939;
			transform-origin: 0 0;
			transform: rotate(-47deg);
		}
		.staff div:nth-child(4):after {
			top: -19px;  left: 69px;
			width: 26px; height: 19px;
			border-radius: 50%;
			background: #393939;
		}
	.staff div:nth-child(5) {
		top: 19px;   left: 281px;
		width: 166px; height: 16px;
		border-radius: 0 0 6px 6px;
		background: #312E36;
	}
		.staff div:nth-child(5):before {
			top: -40px;  left: 32px;
			width: 110px; height: 32px;
			background: #3B4A3E;
			border-radius: 3px 3px 13px 13px;
			transform-origin: 0 0;
			transform: rotate(-14deg);
		}
		.staff div:nth-child(5):after {
			top: -26px;  left: 26px;
			width: 117px; height: 26px;
			background: #5A5A4A;
			border-radius: 2px 2px 6px 6px;
		}
.snail {
	left: 799px;
	animation: snail 30s linear infinite;
}
	.snail__tail {
		top: -21px;  left: 11px;
		width: 192px; height: 21px;
		border-radius: 7px;
		background: #d66362;
		transform-origin: bottom left;
		animation: snailTail 30s linear infinite;
	}
		.snail__tail:before {
			top: -32px; left: 0px;
			width: 73px;
			border-right: 108px solid transparent;
			border-bottom: 32px solid #d66362;
		}
		.snail__tail:after {
			top: -8px;  left: 76px;
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #964554;
		}
		.snail__tail div {
			top: -48px; left: 82px;
			border-left: 17px solid transparent;
			border-right: 17px solid transparent;
			border-bottom: 24px solid #59844f;
			transform: rotate(21deg);
			animation: snailTailSpike 30s linear infinite;
		}
			.snail__tail div:before {
				top: 6px; left: 19px;
				border-left: 17px solid transparent;
				border-right: 17px solid transparent;
				border-bottom: 18px solid #59844f;
				transform: rotate(1deg);
			}
			.snail__tail div:after {
				top: 10px; left: 58px;
				border-left: 13px solid transparent;
				border-right: 13px solid transparent;
				border-bottom: 14px solid #59844f;
				transform: rotate(0deg);
			}
	.snail__body {
		top: -145px;  left: -39px;
		width: 125px; height: 106px;
		border-radius: 30px;
		background: #d66362;
		transform-origin: center 90px;
		animation: snailBody 30s linear infinite;
	}
		.snail__body:before {
			top: 14px;    left: 30px;
			width: 65px; height: 48px;
			border-radius: 50%;
			background: #012135;
			box-shadow: inset 0 0 0 8px #d6e7ca;
			animation: snailEye 30s linear infinite;
			z-index: 1;
		}
		.snail__body:after {
			top: 60px;   left: 11px;
			width: 26px; height: 19px;
			border-radius: 50%;
			background: #964554;
			box-shadow: 20px 14px 0 -3px #964554;
		}
		.snail__body div:nth-child(2) {
			top: -10px; left: 102px;
			width: 17px;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-bottom: 35px solid #d66362;
			transform: rotate(36deg);
			animation: snailRightEye 30s linear infinite;
		}
			.snail__body div:nth-child(2):before {
				top: -16px;  left: -4px;
				width: 26px; height: 19px;
				border-radius: 50%;
				background: #ddad32;
			}
		.snail__body div:nth-child(3) {
			top: -14px; left: 4px;
			width: 17px;
			border-left: 6px solid transparent;
			border-right: 6px solid transparent;
			border-bottom: 35px solid #d66362;
			transform: rotate(-36deg);
			animation: snailLeftEye 30s linear infinite;
		}
			.snail__body div:nth-child(3):before {
				top: -13px;   left: -4px;
				width: 26px; height: 19px;
				border-radius: 50%;
				background: #ddad32;
			}
		.snail__body div:nth-child(4) {
			width: 100%; height: 145px;
			border-radius: 30px;
			overflow: hidden;
			animation: snailSpots 30s linear infinite;
		}
			.snail__body div:nth-child(4):before {
				top: 55px;   left: 106px;
				width: 39px; height: 29px;
				border-radius: 50%;
				background: #964554;
			}
			.snail__body div:nth-child(4):after {
				top: 109px;   left: 2px;
				width: 35px; height: 26px;
				border-radius: 50%;
				background: #964554;
			}
			.snail__body div:nth-child(5):before {
				top: 39px;   left: 0px;
				width: 125px; height: 106px;
				border-radius: 30px;
				background: #d66362;
				animation: snailTummyBottom 30s linear infinite;
			}
			.snail__body div:nth-child(5):after {
				top: 16px;   left: 0px;
				width: 125px; height: 106px;
				border-radius: 30px;
				background: #d66362;
				animation: snailTummyTop 30s linear infinite;
			}
	.snail__head {
		top: -16px; left: 48px;
		border-left: 15px solid transparent;
		border-right: 15px solid transparent;
		border-bottom: 18px solid #59844f;
		animation: snailHead 30s linear infinite;
		z-index: 1;
	}
		.snail__head:before {
			top: 45px; left: 56px;
			border-left: 15px solid transparent;
			border-right: 15px solid transparent;
			border-bottom: 18px solid #59844f;
			transform: rotate(79deg);
			animation: snailSpike1 30s linear infinite;
		}
		.snail__head:after {
			top: 72px; left: 58px;
			border-left: 15px solid transparent;
			border-right: 15px solid transparent;
			border-bottom: 18px solid #59844f;
			transform: rotate(90deg);
			animation: snailSpike2 30s linear infinite;
		}
.piggy {
	left: 825px;
	animation: piggy 30s linear infinite;
	z-index: -1;
}
	.piggy__body {
		top: -109px;   left: -56px;
		width: 216px; height: 81px;
		border-radius: 29px 29px 0 0;
		background: #cedd51;
		animation: piggyBody 30s linear infinite;
	}
	.piggy__front-legs {
		animation: piggyFrontLegs 30s linear infinite;
	}
		.piggy__front-legs:before {
			top: -29px;  left: -56px;
			width: 52px; height: 29px;
			border-radius: 0 0 100% 0;
			background: #689842;
			transform-origin: top left;
			animation: piggyFirstLeg 30s linear infinite;
		}
		.piggy__front-legs:after {
			top: -29px;  left: -2px;
			width: 52px; height: 29px;
			border-radius: 0 0 100% 0;
			background: #689842;
			transform-origin: top left;
			animation: piggySecondLeg 30s linear infinite;
		}
	.piggy__back-legs {
		animation: piggyBackLegs 30s linear infinite;
	}
		.piggy__back-legs:before {
			top: -29px;  left: 52px;
			width: 52px; height: 29px;
			border-radius: 0 0 100% 0;
			background: #689842;
			transform-origin: top left;
			animation: piggyThirdLeg 30s linear infinite;
		}
		.piggy__back-legs:after {
			top: -29px;  left: 108px;
			width: 52px; height: 29px;
			border-radius: 0 0 0 100%;
			background: #689842;
			transform-origin: top left;
			animation: piggyFourthLeg 30s linear infinite;
		}
	.piggy__ear-right {
		top: -134px;  left: 22px;
		width: 48px; height: 35px;
		border-radius: 90% 0;
		background: #ad5261;
		border: 8px solid #cedd51;
		animation: piggyRightEar 30s linear infinite;
	}
	.piggy__ear-left {
		top: -135px;  left: -89px;
		width: 48px; height: 35px;
		border-radius: 0 90%;
		background: #ad5261;
		border: 8px solid #cedd51;
		transform: rotate(7deg);
		animation: piggyLeftEar 30s linear infinite;
	}
	.piggy__tail {
		top: -116px;  left: 145px;
		width: 45px; height: 35px;
		border-radius: 0 100% 0 12px;
		background: #ffffce;
		animation: piggyTail 30s linear infinite;
	}
	.piggy__hair {
		top: -111px; left: -35px;
		animation: piggyHair 30s linear infinite;
	}
		.piggy__hair:before {
			top: -16px; left: 43px;
			width: 17px; height: 19px;
			border-radius: 0 10px 0 0;
			background: #ffffce;
		}
		.piggy__hair:after {
			top: -11px;  left: 13px;
			width: 17px; height: 19px;
			border-radius: 10px 0 0 0;
			background: #ffffce;
			transform: rotate(-30deg);
		}
	.piggy__eyes {
		top: -69px; left: -37px;
	}
		.piggy__eyes:before {
			left: 2px;   top: -5px;
			width: 32px; height: 13px;
			border-radius: 0 0 10px 10px;
			background: #1a2530;
			animation: piggyRightEye 30s linear infinite;
		}
		.piggy__eyes:after {
			left: 45px;  top: -13px;
			width: 32px; height: 24px;
			border-radius: 50%;
			background: #1a2530;
			animation: piggyLeftEye 30s linear infinite;
		}
	.piggy__mouth {
		top: -52px; left: -13px;
		width: 13px; height: 6px;
		border-radius: 4px 4px 0 0;
		border-top: 6px solid #964554;
		border-left: 9px solid #964554;
		border-right: 9px solid #964554;
		animation: piggyMouth 30s linear infinite;
	}
		.piggy__mouth:before {
			top: -21px;  left: 22px;
			width: 54px; height: 40px;
			border-radius: 50%;
			background: #feecb2;
			animation: piggyCheekRight 30s linear infinite;
		}
		.piggy__mouth:after {
			top: -19px;  left: -63px;
			width: 54px; height: 40px;
			border-radius: 50%;
			background: #feecb2;
			animation: piggyCheekLeft 30s linear infinite;
		}
.wasp {
	left: 842px;
	animation: wasp 30s linear infinite;
}
	.wasp__legs {
		top: -35px; left: -15px;
		border-right: 43px solid transparent;
		border-left: 43px solid transparent;
		border-bottom: 35px solid #012135;
		transform-origin: top center;
		animation: waspLegs 30s linear infinite;
	}
		.wasp__legs div {
			top: 19px;   left: -6px;
			width: 22px; height: 48px;
			border-radius: 5px;
			background: #012135;
			transform-origin: top center;
			transform: rotate(146deg);
			animation: waspLegKnee 30s linear infinite;
		}
			.wasp__legs div:before {
				top: 40px;   left: 0px;
				width: 22px; height: 48px;
				border-radius: 5px;
				background: #012135;
				transform-origin: top center;
				transform: rotate(124deg);
				animation: waspLegHip 30s linear infinite;
			}
	.wasp__body {
		top: -116px;   left: -65px;
		width: 251px; height: 58px;
		border-radius: 37px 0;
		background: linear-gradient(to right, #ddad32 29%, #012135 29%, #012135 47%, #ddad32 40%, #ddad32 64%, #d6e7ca 64%);
		animation: waspBody 30s linear infinite;
	}
		.wasp__body:before {
			top: 0px;    left: 158px;
			width: 76px; height: 31px;
			border-radius: 0 0 20px 20px;
			background: #c44c57;
		}
		.wasp__body:after {
			top: -13px;   left: 175px;
			width: 41px; height: 31px;
			border-radius: 50%;
			background: #012135;
			animation: waspEye 30s linear infinite;
		}
		.wasp__body div {
			top: 0px;   left: 251px;
			width: 19px; height: 14px;
			border-radius: 0 40px 0 0;
			border-top: 19px solid #012135;
			border-right: 19px solid #012135;
		}
			.wasp__body div:before {
				top: 39px;   left: -91px;
				width: 54px; height: 16px;
				border-radius: 0 20px 0 0;
				border-top: 13px solid #012135;
				border-right: 17px solid #012135;
			}
	.wasp__wing {
		top: -198px; left: -15px;
		width: 108px; height: 81px;
		border-radius: 43px 0 0 0;
		background: linear-gradient(62deg, #d6e7ca 65%, transparent 65%);
		transform-origin: bottom right;
		transform: rotate(28deg);
		animation: waspWing 30s linear infinite;
	}
		.wasp__wing:before {
			bottom: 0px; right: 0px;
			width: 76px; height: 56px;
			border-radius: 43px 0 0 0;
			background: linear-gradient(62deg, #509bbc 65%, transparent 65%);
		}
.soul-1 {
	top: -322px; left: 281px;
	width: 65px; height: 122px;
	opacity: 0.7;
	transform-origin: bottom center;
	animation: soul 30s linear -12.1s infinite;
}
	.soul-1__part1 {
		animation: soulPart1 30s linear -12.1s infinite;
		top: -32px; left: -35px;
		width: 13px; height: 14px;
	}
		.soul-1__part1:before {
			width: 13px; height: 14px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart1Before 30s linear -12.1s infinite;
		}
	.soul-1__part2 {
		animation: soulPart2 30s linear -12.1s infinite;
		top: 72px;  left: -37px;
		width: 17px; height: 13px;
	}
		.soul-1__part2:before {
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart2Before 30s linear -12.1s infinite;
		}
	.soul-1__part3 {
		animation: soulPart3 30s linear -12.1s infinite;
		top: -48px; left: 97px;
		width: 15px; height: 10px;
	}
		.soul-1__part3:before {
			width: 15px; height: 10px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart3Before 30s linear -12.1s infinite;
		}
	.soul-1__part4 {
		animation: soulPart4 30s linear -12.1s infinite;
		top: -68px;  left: 30px;
		width: 26px; height: 53px;
	}
		.soul-1__part4:before {
			width: 26px; height: 53px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart4Before 30s linear -12.1s infinite;
		}
	.soul-1__part5 {
		animation: soulPart5 30s linear -12.1s infinite;
		top: -47px;  left: -17px;
		width: 110px; height: 84px;
	}
		.soul-1__part5:before {
			width: 110px; height: 84px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart5Before 30s linear -12.1s infinite;
		}
	.soul-1__part6 {
		animation: soulPart6 30s linear -12.1s infinite;
		top: -16px;  left: 48px;
		width: 73px; height: 52px;
	}
		.soul-1__part6:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart6Before 30s linear -12.1s infinite;
		}
	.soul-1__part7 {
		animation: soulPart7 30s linear -12.1s infinite;
		top: -2px;   left: 43px;
		width: 73px; height: 52px;
	}
		.soul-1__part7:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart7Before 30s linear -12.1s infinite;
		}
	.soul-1__part8 {
		animation: soulPart8 30s linear -12.1s infinite;
		top: -11px;   left: -43px;
		width: 73px; height: 52px;
	}
		.soul-1__part8:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart8Before 30s linear -12.1s infinite;
		}
	.soul-1__part9 {
		animation: soulPart9 30s linear -12.1s infinite;
		top: 13px;    left: -48px;
		width: 52px; height: 35px;
	}
		.soul-1__part9:before {
			width: 52px; height: 35px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart9Before 30s linear -12.1s infinite;
		}
	.soul-1__part10 {
		animation: soulPart10 30s linear -12.1s infinite;
		top: -3px;   left: -24px;
		width: 119px; height: 93px;
	}
		.soul-1__part10:before {
			width: 119px; height: 93px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart10Before 30s linear -12.1s infinite;
		}
	.soul-1__part11 {
		animation: soulPart11 30s linear -12.1s infinite;
		top: 77px;  left: 26px;
		width: 11px; height: 61px;
	}
		.soul-1__part11:before {
			width: 11px; height: 61px;
			background: #2ac88c;
			border-radius: 5px;
			animation: soulPart11Before 30s linear -12.1s infinite;
		}
	.soul-1__part12 {
		animation: soulPart12 30s linear -12.1s infinite;
		top: -16px;  left: 0px;
		width: 35px; height: 29px;
	}
		.soul-1__part12:before {
			width: 35px; height: 29px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart12Before 30s linear -12.1s infinite;
		}
	.soul-1__part13 {
		animation: soulPart13 30s linear -12.1s infinite;
		top: -6px;   left: 43px;
		width: 30px; height: 26px;
	}
		.soul-1__part13:before {
			width: 30px; height: 26px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart13Before 30s linear -12.1s infinite;
		}
	.soul-1__part14 {
		animation: soulPart14 30s linear -12.1s infinite;
		top: -77px;  left: 28px;
		width: 30px; height: 21px;
	}
		.soul-1__part14:before {
			width: 30px; height: 21px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart14Before 30s linear -12.1s infinite;
		}
	.soul-1__part15 {
		animation: soulPart15 30s linear -12.1s infinite;
		top: 100px;  left: 65px;
		width: 17px; height: 16px;
	}
		.soul-1__part15:before {
			width: 17px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart15Before 30s linear -12.1s infinite;
		}
	.soul-1__part16 {
		animation: soulPart16 30s linear -12.1s infinite;
		top: 119px;  left: 56px;
		width: 15px; height: 16px;
	}
		.soul-1__part16:before {
			width: 15px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart16Before 30s linear -12.1s infinite;
		}
.soul-2 {
	top: -322px; left: 281px;
	width: 65px; height: 122px;
	opacity: 0.7;
	transform-origin: bottom center;
	animation: soul 30s linear infinite;
}
	.soul-2__part1 {
		animation: soulPart1 30s linear infinite;
		top: -32px; left: -35px;
		width: 13px; height: 14px;
	}
		.soul-2__part1:before {
			width: 13px; height: 14px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart1Before 30s linear infinite;
		}
	.soul-2__part2 {
		animation: soulPart2 30s linear infinite;
		top: 72px;  left: -37px;
		width: 17px; height: 13px;
	}
		.soul-2__part2:before {
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart2Before 30s linear infinite;
		}
	.soul-2__part3 {
		animation: soulPart3 30s linear infinite;
		top: -48px; left: 97px;
		width: 15px; height: 10px;
	}
		.soul-2__part3:before {
			width: 15px; height: 10px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart3Before 30s linear infinite;
		}
	.soul-2__part4 {
		animation: soulPart4 30s linear infinite;
		top: -68px;  left: 30px;
		width: 26px; height: 53px;
	}
		.soul-2__part4:before {
			width: 26px; height: 53px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart4Before 30s linear infinite;
		}
	.soul-2__part5 {
		animation: soulPart5 30s linear infinite;
		top: -47px;  left: -17px;
		width: 110px; height: 84px;
	}
		.soul-2__part5:before {
			width: 110px; height: 84px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart5Before 30s linear infinite;
		}
	.soul-2__part6 {
		animation: soulPart6 30s linear infinite;
		top: -16px;  left: 48px;
		width: 73px; height: 52px;
	}
		.soul-2__part6:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart6Before 30s linear infinite;
		}
	.soul-2__part7 {
		animation: soulPart7 30s linear infinite;
		top: -2px;   left: 43px;
		width: 73px; height: 52px;
	}
		.soul-2__part7:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart7Before 30s linear infinite;
		}
	.soul-2__part8 {
		animation: soulPart8 30s linear infinite;
		top: -11px;   left: -43px;
		width: 73px; height: 52px;
	}
		.soul-2__part8:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart8Before 30s linear infinite;
		}
	.soul-2__part9 {
		animation: soulPart9 30s linear infinite;
		top: 13px;    left: -48px;
		width: 52px; height: 35px;
	}
		.soul-2__part9:before {
			width: 52px; height: 35px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart9Before 30s linear infinite;
		}
	.soul-2__part10 {
		animation: soulPart10 30s linear infinite;
		top: -3px;   left: -24px;
		width: 119px; height: 93px;
	}
		.soul-2__part10:before {
			width: 119px; height: 93px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart10Before 30s linear infinite;
		}
	.soul-2__part11 {
		animation: soulPart11 30s linear infinite;
		top: 77px;  left: 26px;
		width: 11px; height: 61px;
	}
		.soul-2__part11:before {
			width: 11px; height: 61px;
			background: #2ac88c;
			border-radius: 5px;
			animation: soulPart11Before 30s linear infinite;
		}
	.soul-2__part12 {
		animation: soulPart12 30s linear infinite;
		top: -16px;  left: 0px;
		width: 35px; height: 29px;
	}
		.soul-2__part12:before {
			width: 35px; height: 29px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart12Before 30s linear infinite;
		}
	.soul-2__part13 {
		animation: soulPart13 30s linear infinite;
		top: -6px;   left: 43px;
		width: 30px; height: 26px;
	}
		.soul-2__part13:before {
			width: 30px; height: 26px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart13Before 30s linear infinite;
		}
	.soul-2__part14 {
		animation: soulPart14 30s linear infinite;
		top: -77px;  left: 28px;
		width: 30px; height: 21px;
	}
		.soul-2__part14:before {
			width: 30px; height: 21px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart14Before 30s linear infinite;
		}
	.soul-2__part15 {
		animation: soulPart15 30s linear infinite;
		top: 100px;  left: 65px;
		width: 17px; height: 16px;
	}
		.soul-2__part15:before {
			width: 17px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart15Before 30s linear infinite;
		}
	.soul-2__part16 {
		animation: soulPart16 30s linear infinite;
		top: 119px;  left: 56px;
		width: 15px; height: 16px;
	}
		.soul-2__part16:before {
			width: 15px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart16Before 30s linear infinite;
		}
.soul-3 {
	top: -322px; left: 281px;
	width: 65px; height: 122px;
	opacity: 0.7;
	transform-origin: bottom center;
	animation: soul 30s linear -51.9s infinite;
}
	.soul-3__part1 {
		animation: soulPart1 30s linear -51.9s infinite;
		top: -32px; left: -35px;
		width: 13px; height: 14px;
	}
		.soul-3__part1:before {
			width: 13px; height: 14px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart1Before 30s linear -51.9s infinite;
		}
	.soul-3__part2 {
		animation: soulPart2 30s linear -51.9s infinite;
		top: 72px;  left: -37px;
		width: 17px; height: 13px;
	}
		.soul-3__part2:before {
			width: 17px; height: 13px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart2Before 30s linear -51.9s infinite;
		}
	.soul-3__part3 {
		animation: soulPart3 30s linear -51.9s infinite;
		top: -48px; left: 97px;
		width: 15px; height: 10px;
	}
		.soul-3__part3:before {
			width: 15px; height: 10px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart3Before 30s linear -51.9s infinite;
		}
	.soul-3__part4 {
		animation: soulPart4 30s linear -51.9s infinite;
		top: -68px;  left: 30px;
		width: 26px; height: 53px;
	}
		.soul-3__part4:before {
			width: 26px; height: 53px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart4Before 30s linear -51.9s infinite;
		}
	.soul-3__part5 {
		animation: soulPart5 30s linear -51.9s infinite;
		top: -47px;  left: -17px;
		width: 110px; height: 84px;
	}
		.soul-3__part5:before {
			width: 110px; height: 84px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart5Before 30s linear -51.9s infinite;
		}
	.soul-3__part6 {
		animation: soulPart6 30s linear -51.9s infinite;
		top: -16px;  left: 48px;
		width: 73px; height: 52px;
	}
		.soul-3__part6:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart6Before 30s linear -51.9s infinite;
		}
	.soul-3__part7 {
		animation: soulPart7 30s linear -51.9s infinite;
		top: -2px;   left: 43px;
		width: 73px; height: 52px;
	}
		.soul-3__part7:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart7Before 30s linear -51.9s infinite;
		}
	.soul-3__part8 {
		animation: soulPart8 30s linear -51.9s infinite;
		top: -11px;   left: -43px;
		width: 73px; height: 52px;
	}
		.soul-3__part8:before {
			width: 73px; height: 52px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart8Before 30s linear -51.9s infinite;
		}
	.soul-3__part9 {
		animation: soulPart9 30s linear -51.9s infinite;
		top: 13px;    left: -48px;
		width: 52px; height: 35px;
	}
		.soul-3__part9:before {
			width: 52px; height: 35px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart9Before 30s linear -51.9s infinite;
		}
	.soul-3__part10 {
		animation: soulPart10 30s linear -51.9s infinite;
		top: -3px;   left: -24px;
		width: 119px; height: 93px;
	}
		.soul-3__part10:before {
			width: 119px; height: 93px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart10Before 30s linear -51.9s infinite;
		}
	.soul-3__part11 {
		animation: soulPart11 30s linear -51.9s infinite;
		top: 77px;  left: 26px;
		width: 11px; height: 61px;
	}
		.soul-3__part11:before {
			width: 11px; height: 61px;
			background: #2ac88c;
			border-radius: 5px;
			animation: soulPart11Before 30s linear -51.9s infinite;
		}
	.soul-3__part12 {
		animation: soulPart12 30s linear -51.9s infinite;
		top: -16px;  left: 0px;
		width: 35px; height: 29px;
	}
		.soul-3__part12:before {
			width: 35px; height: 29px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart12Before 30s linear -51.9s infinite;
		}
	.soul-3__part13 {
		animation: soulPart13 30s linear -51.9s infinite;
		top: -6px;   left: 43px;
		width: 30px; height: 26px;
	}
		.soul-3__part13:before {
			width: 30px; height: 26px;
			border-radius: 50%;
			background: #2a2f3a;
			animation: soulPart13Before 30s linear -51.9s infinite;
		}
	.soul-3__part14 {
		animation: soulPart14 30s linear -51.9s infinite;
		top: -77px;  left: 28px;
		width: 30px; height: 21px;
	}
		.soul-3__part14:before {
			width: 30px; height: 21px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart14Before 30s linear -51.9s infinite;
		}
	.soul-3__part15 {
		animation: soulPart15 30s linear -51.9s infinite;
		top: 100px;  left: 65px;
		width: 17px; height: 16px;
	}
		.soul-3__part15:before {
			width: 17px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart15Before 30s linear -51.9s infinite;
		}
	.soul-3__part16 {
		animation: soulPart16 30s linear -51.9s infinite;
		top: 119px;  left: 56px;
		width: 15px; height: 16px;
	}
		.soul-3__part16:before {
			width: 15px; height: 16px;
			border-radius: 50%;
			background: #2ac88c;
			animation: soulPart16Before 30s linear -51.9s infinite;
		}

@keyframes moth {
	0%      { transform: rotate(30deg)  translate(0px, 0px);}
	5%      { transform: rotate(60deg)  translate(23px, 5px); }
	7%      { transform: rotate(82deg)  translate(11px, -3px); }
	12%     { transform: rotate(0deg)   translate(-6px, 6px); }
	17%     { transform: rotate(5deg)   translate(-6px, 13px); }
	22%     { transform: rotate(-2deg)  translate(-2px, 0px); }
	24%     { transform: rotate(-2deg)  translate(0px, 10px); }
	28%     { transform: rotate(18deg)  translate(-1px, 0px); }
	34%     { transform: rotate(63deg)  translate(20px, -1px); }
	37%     { transform: rotate(40deg)  translate(10px, 1px); }
	41%     { transform: rotate(34deg)  translate(4px, 7px); }
	44%     { transform: rotate(12deg)  translate(0px, 6px); }
	49%     { transform: rotate(63deg)  translate(18px, 8px); }
	51%     { transform: rotate(0deg)   translate(-12px, 6px); }
	54%     { transform: rotate(-6deg)  translate(-9px, 2px); }
	56%     { transform: rotate(16deg)  translate(-2px, 10px); }
	59%     { transform: rotate(13deg)  translate(-3px, 6px); }
	61%     { transform: rotate(19deg)  translate(0px, 7px); }
	66%     { transform: rotate(-13deg) translate(-6px, 2px); }
	68%     { transform: rotate(25deg)  translate(0px, 7px); }
	73%     { transform: rotate(22deg)  translate(3px, 1px); }
	76%     { transform: rotate(-19deg) translate(-8px, -3px); }
	81%     { transform: rotate(1deg)   translate(6px, 8px); }
	83%     { transform: rotate(-17deg) translate(-5px, 0px); }
	88%     { transform: rotate(50deg)  translate(4px, -2px); }
	90%     { transform: rotate(70deg)  translate(8px, -1px); }
	93%     { transform: rotate(56deg)  translate(14px, 6px); }
	98%     { transform: rotate(34deg)  translate(0px, 10px); }
	100%    { transform: rotate(30deg)  translate(0px, 0px); }
}
@keyframes mothWingRight {
	0%      { transform: rotate(40deg); }
	5%      { transform: rotate(90deg); }
	7%      { transform: rotate(35deg); }
	12%     { transform: rotate(98deg); }
	17%     { transform: rotate(88deg); }
	22%     { transform: rotate(38deg); }
	24%     { transform: rotate(88deg); }
	28%     { transform: rotate(35deg); }
	34%     { transform: rotate(85deg); }
	37%     { transform: rotate(41deg); }
	41%     { transform: rotate(83deg); }
	44%     { transform: rotate(42deg); }
	49%     { transform: rotate(73deg); }
	51%     { transform: rotate(45deg); }
	54%     { transform: rotate(94deg); }
	56%     { transform: rotate(74deg); }
	59%     { transform: rotate(43deg); }
	61%     { transform: rotate(104deg); }
	66%     { transform: rotate(44deg); }
	68%     { transform: rotate(96deg); }
	73%     { transform: rotate(51deg); }
	76%     { transform: rotate(108deg); }
	81%     { transform: rotate(46deg); }
	83%     { transform: rotate(107deg); }
	88%     { transform: rotate(51deg); }
	90%     { transform: rotate(112deg); }
	93%     { transform: rotate(59deg); }
	98%     { transform: rotate(100deg); }
	100%    {  transform: rotate(40deg); }
}
@keyframes mothWingLeft {
	0%      { transform: rotate(-43deg); }
	5%      { transform: rotate(-103deg); }
	7%      { transform: rotate(-40deg); }
	12%     { transform: rotate(-91deg); }
	17%     { transform: rotate(-80deg); }
	22%     { transform: rotate(-39deg); }
	24%     { transform: rotate(-85deg); }
	28%     { transform: rotate(-44deg); }
	34%     { transform: rotate(-87deg); }
	37%     { transform: rotate(-37deg); }
	41%     { transform: rotate(-79deg); }
	44%     { transform: rotate(-38deg); }
	49%     { transform: rotate(-82deg); }
	51%     { transform: rotate(-31deg); }
	54%     { transform: rotate(-98deg); }
	56%     { transform: rotate(-76deg); }
	59%     { transform: rotate(-42deg); }
	61%     { transform: rotate(-102deg); }
	66%     { transform: rotate(-42deg); }
	68%     { transform: rotate(-108deg); }
	73%     { transform: rotate(-45deg); }
	76%     { transform: rotate(-98deg); }
	81%     { transform: rotate(-49deg); }
	83%     { transform: rotate(-99deg); }
	88%     { transform: rotate(-54deg); }
	90%     { transform: rotate(-102deg); }
	93%     { transform: rotate(-58deg); }
	98%     { transform: rotate(-102deg); }
	100%    { transform: rotate(-43deg); }
}
@keyframes driedFlower {
	0%  { transform: rotate(4deg); }
	50% { transform: rotate(-6deg); }
	100%{ transform: rotate(4deg); }
}
@keyframes shelfHerbs1 {
	0%  { transform: rotate(7deg); }
	50% { transform: rotate(-7deg); }
	100%{ transform: rotate(7deg); }
}
@keyframes shelfHerbs2 {
	0%  { transform: rotate(-22deg); }
	50% { transform: rotate(-13deg); }
	100%{ transform: rotate(-22deg); }
}
@keyframes shelfHerbs3 {
	0%  { transform: rotate(-1deg); }
	50% { transform: rotate(10deg); }
	100%{ transform: rotate(-1deg); }
}
@keyframes shelfHerbs4 {
	0%  { transform: rotate(1deg); }
	50% { transform: rotate(-9deg); }
	100%{ transform: rotate(1deg); }
}
@keyframes bottle3Dude1 {
	0.0% { transform: translate(-15px, -18px) rotate(12deg); }
	40%  { transform: translate(5px, 10px) rotate(12deg); }
	50%  { transform: translate(5px, 10px) rotate(-168deg); }
	90%  { transform: translate(-15px, -18px) rotate(-168deg); }
	100% { transform: translate(-15px, -18px) rotate(12deg); }
}
@keyframes bottle3Dude2 {
	0.0%  { transform: translate(-5px, -18px) rotate(22deg); }
	17.5% { transform: translate(5px, 12px) rotate(22deg); }
	27.5% { transform: translate(5px, 12px) rotate(-68deg); }
	45.0% { transform: translate(35px, -8px) rotate(-68deg); }
	55.0% { transform: translate(35px, -8px) rotate(-188deg); }
	72.5% { transform: translate(-5px, -18px) rotate(-188deg); }
	100%  { transform: translate(-5px, -18px) rotate(22deg); }
}
@keyframes bottle3Dude3 {
	0%   { transform: translate(-23px, 18px) rotate(-80deg); }
	40%  { transform: translate(7px, -2px) rotate(-80deg); }
	50%  { transform: translate(7px, -2px) rotate(110deg); }
	90%  { transform: translate(-23px, 18px) rotate(110deg); }
	100% { transform: translate(-23px, 18px) rotate(-80deg); }
}
@keyframes bottle2Dude1 {
	0%  { transform: rotate(8deg)   translate(0px, 0px); }
	50% { transform: rotate(12deg)  translate(-8px, 3px); }
	100%{ transform: rotate(8deg)   translate(0px, 0px); }
}
@keyframes bottle2Dude2 {
	0%  { transform: rotate(8deg)   translate(0px, 0px); }
	50% { transform: rotate(-2deg)  translate(-3px, -4px); }
	100%{ transform: rotate(8deg)   translate(0px, 0px); }
}
@keyframes bottle2Dude3 {
	0%  { transform: rotate(-15deg) translate(0px, 0px); }
	50% { transform: rotate(-7deg)  translate(6px, -5px); }
	100%{ transform: rotate(-15deg) translate(0px, 0px); }
}
@keyframes bottle3Dust1 {
	0%   { transform: translate(2px, 6px) scale(0); }
	33%  { transform: translate(-8px, -14px) scale(1); }
	66%  { transform: translate(2px, -44px) scale(0.6); }
	100% { transform: translate(-8px, -84px) scale(0); }
}
@keyframes bottle3Dust2 {
	0%   { transform: translate(0px, 9px) scale(0); }
	33%  { transform: translate(10px, -21px) scale(1); }
	66%  { transform: translate(-10px, -61px) scale(0.6); }
	100% { transform: translate(0px, -91px) scale(0); }
}
@keyframes bottle3Dust3 {
	0%   { transform: translate(0px, 9px) scale(0); }
	33%  { transform: translate(-10px, -21px) scale(1); }
	66%  { transform: translate(10px, -51px) scale(0.6); }
	100% { transform: translate(0px, -81px) scale(0); }
}
@keyframes bottle3Dust4 {
	0%   { transform: translate(0px, 25px) scale(0); }
	33%  { transform: translate(20px, -5px) scale(1); }
	66%  { transform: translate(0px, -45px) scale(0.6); }
	100% { transform: translate(10px, -75px) scale(0); }
}
@keyframes bottle3Dust5 {
	0%   { transform: translate(-24px, 19px) scale(0); }
	33%  { transform: translate(-44px, -11px) scale(1); }
	66%  { transform: translate(-24px, -51px) scale(0.6); }
	100% { transform: translate(-34px, -91px) scale(0); }
}
@keyframes bottle3Dust6 {
	0%   { transform: translate(0px, 40px) scale(0); }
	33%  { transform: translate(10px, 0px) scale(1); }
	66%  { transform: translate(-10px, -40px) scale(0.6); }
	100% { transform: translate(0px, -70px) scale(0); }
}
@keyframes bottle3Dust7 {
	0%   { transform: translate(-18px, 60px) scale(0); }
	33%  { transform: translate(-38px, 20px) scale(1); }
	66%  { transform: translate(-18px, -20px) scale(0.6); }
	100% { transform: translate(-28px, -60px) scale(0); }
}
@keyframes bottle3Dust8 {
	0%   { transform: translate(7px, 60px) scale(0); }
	33%  { transform: translate(17px, 20px) scale(1); }
	66%  { transform: translate(-3px, -30px) scale(0.6); }
	100% { transform: translate(13px, -70px) scale(0); }
}
@keyframes bottle3Dust9 {
	0%   { transform: translate(-6px, 55px) scale(0); }
	33%  { transform: translate(-26px, 15px) scale(1); }
	66%  { transform: translate(-6px, -25px) scale(0.6); }
	100% { transform: translate(-16px, -65px) scale(0); }
}
@keyframes bottle3Dust10 {
	0%   { transform: translate(-40px, 71px) scale(0); }
	33%  { transform: translate(-60px, 31px) scale(1); }
	66%  { transform: translate(-40px, -19px) scale(0.6); }
	100% { transform: translate(-50px, -59px) scale(0); }
}
@keyframes shelfStaff2Dust1 {
	0%   { transform: translate(0px, 0px); }
	15%  { transform: translate(10px, -5px); }
	30%  { transform: translate(20px, 5px); }
	45%  { transform: translate(10px, 15px); }
	60%  { transform: translate(0px, 25px); }
	75%  { transform: translate(-20px, 15px); }
	90%  { transform: translate(-10px, 5px); }
	100% { transform: translate(0px, 0px); }
}
@keyframes shelfStaff2Dust2 {
	0%   { transform: translate(0px, 0px); }
	15%  { transform: translate(-10px, 10px); }
	30%  { transform: translate(10px, 5px); }
	45%  { transform: translate(20px, 15px); }
	60%  { transform: translate(30px, 35px); }
	75%  { transform: translate(30px, 5px); }
	90%  { transform: translate(10px, 10px); }
	100% { transform: translate(0px, 0px); }
}
@keyframes shelfStaff2Dust3 {
	0%   { transform: translate(0px, 0px); }
	15%  { transform: translate(10px, 10px); }
	30%  { transform: translate(20px, 0px); }
	45%  { transform: translate(0px, -10px); }
	60%  { transform: translate(-7px, 10px); }
	75%  { transform: translate(-17px, 17px); }
	90%  { transform: translate(4px, 22px); }
	100% { transform: translate(0px, 0px); }
}
@keyframes shelfStaff2Dust4 {
	0%   { transform: translate(0px, 0px); }
	15%  { transform: translate(4px, 12px); }
	30%  { transform: translate(-16px, 7px); }
	45%  { transform: translate(-22px, 17px); }
	60%  { transform: translate(-12px, 7px); }
	75%  { transform: translate(-2px, -3px); }
	90%  { transform: translate(18px, 7px); }
	100% { transform: translate(0px, 0px); }
}
@keyframes fireItem1 {
	0%   { transform: translate(0px, 0px) scale(1) rotate(-45deg); }
	100% { transform: translate(10px, -40px) scale(0) rotate(-45deg); }
}
@keyframes fireItem2 {
	0%   { transform: translate(0px, 0px) scale(1) rotate(-45deg); }
	100% { transform: translate(-10px, -40px) scale(0) rotate(-45deg); }
}
@keyframes fireItem3 {
	0%   { transform: translate(0px, 0px) scale(1) rotate(-45deg); }
	100% { transform: translate(25px, -50px) scale(0) rotate(-45deg); }
}
@keyframes fireItem4 {
	0%   { transform: translate(0px, 0px) scale(1) rotate(-45deg); }
	100% { transform: translate(-25px, -50px) scale(0) rotate(-45deg); }
}
@keyframes fireItem5 {
	0%   { transform: translate(0px, 0px) scale(1) rotate(-45deg); }
	100% { transform: translate(0px, -50px) scale(0) rotate(-45deg); }
}
@keyframes fireItem6 {
	0%   { transform: scale(1) rotate(-45deg); }
	50%  { transform: scale(0.6) rotate(-45deg); }
	100% { transform: scale(1) rotate(-45deg); }
}
@keyframes plants2 {
	5.7%  { transform: rotate(65deg); }
	6.6%  { transform: rotate(74deg); }
	6.9%  { transform: rotate(82deg); }
	7.2%  { transform: rotate(80deg); }
	7.5%  { transform: rotate(71deg); }
	7.8%  { transform: rotate(61deg); }
	8.1%  { transform: rotate(51deg); }
	8.4%  { transform: rotate(47deg); }
	8.7%  { transform: rotate(50deg); }
	9.0%  { transform: rotate(56deg); }
	9.3%  { transform: rotate(63deg); }
	9.6%  { transform: rotate(69deg); }
	9.9%  { transform: rotate(71deg); }
	10.2% { transform: rotate(70deg); }
	10.5% { transform: rotate(65deg); }
	10.8% { transform: rotate(59deg); }
	11.1% { transform: rotate(57deg); }
	11.4% { transform: rotate(56deg); }
	11.7% { transform: rotate(58deg); }
	12.0% { transform: rotate(61deg); }
	12.3% { transform: rotate(63deg); }
	12.6% { transform: rotate(64deg); }
	12.9% { transform: rotate(65deg); }
	13.2% { transform: rotate(63deg); }

	18.6% { transform: rotate(63deg); }
	19.2% { transform: rotate(49deg); }
	20.1% { transform: rotate(73deg); }
	21.0% { transform: rotate(59deg); }
	21.6% { transform: rotate(63deg); }

	24.9% { transform: rotate(63deg); }
	25.5% { transform: rotate(49deg); }
	26.4% { transform: rotate(73deg); }
	27.3% { transform: rotate(59deg); }
	27.9% { transform: rotate(63deg); }

	45.9% { transform: rotate(63deg); }
	46.2% { transform: rotate(62deg); }
	46.5% { transform: rotate(65deg); }
	46.8% { transform: rotate(74deg); }
	47.1% { transform: rotate(81deg); }
	47.4% { transform: rotate(80deg); }
	47.7% { transform: rotate(72deg); }
	48.0% { transform: rotate(61deg); }
	48.3% { transform: rotate(50deg); }
	48.6% { transform: rotate(47deg); }
	48.9% { transform: rotate(49deg); }
	49.2% { transform: rotate(56deg); }
	49.5% { transform: rotate(63deg); }
	49.8% { transform: rotate(69deg); }
	50.1% { transform: rotate(72deg); }
	50.4% { transform: rotate(71deg); }
	50.7% { transform: rotate(64deg); }
	51.0% { transform: rotate(60deg); }
	51.3% { transform: rotate(57deg); }
	51.6% { transform: rotate(57deg); }
	51.9% { transform: rotate(59deg); }
	52.2% { transform: rotate(61deg); }
	52.5% { transform: rotate(63deg); }
	52.8% { transform: rotate(65deg); }
	53.4% { transform: rotate(65deg); }
	53.7% { transform: rotate(63deg); }

	58.5% { transform: rotate(63deg); }
	58.8% { transform: rotate(56deg); }
	59.1% { transform: rotate(49deg); }
	59.4% { transform: rotate(54deg); }
	59.7% { transform: rotate(68deg); }
	60.0% { transform: rotate(73deg); }
	60.3% { transform: rotate(70deg); }
	60.6% { transform: rotate(63deg); }
	60.9% { transform: rotate(60deg); }
	61.2% { transform: rotate(61deg); }
	61.5% { transform: rotate(63deg); }

	74.1% { transform: rotate(63deg); }
	74.4% { transform: rotate(62deg); }
	74.7% { transform: rotate(66deg); }
	75.0% { transform: rotate(76deg); }
	75.3% { transform: rotate(82deg); }
	75.6% { transform: rotate(80deg); }
	75.9% { transform: rotate(73deg); }
	76.2% { transform: rotate(61deg); }
	76.5% { transform: rotate(51deg); }
	76.8% { transform: rotate(48deg); }
	77.1% { transform: rotate(50deg); }
	77.4% { transform: rotate(56deg); }
	77.7% { transform: rotate(63deg); }
	78.0% { transform: rotate(69deg); }
	78.3% { transform: rotate(71deg); }
	78.6% { transform: rotate(70deg); }
	78.9% { transform: rotate(64deg); }
	79.2% { transform: rotate(59deg); }
	79.5% { transform: rotate(56deg); }
	79.8% { transform: rotate(57deg); }
	80.1% { transform: rotate(59deg); }
	80.4% { transform: rotate(61deg); }
	80.7% { transform: rotate(64deg); }
	81.3% { transform: rotate(64deg); }
	81.6% { transform: rotate(63deg); }

	93.6% { transform: rotate(63deg); }
	93.9% { transform: rotate(55deg); }
	94.2% { transform: rotate(49deg); }
	94.5% { transform: rotate(54deg); }
	94.8% { transform: rotate(68deg); }
	95.1% { transform: rotate(73deg); }
	95.4% { transform: rotate(70deg); }
	95.7% { transform: rotate(63deg); }
	96.0% { transform: rotate(59deg); }
	96.3% { transform: rotate(61deg); }
	96.6% { transform: rotate(63deg); }
}
@keyframes plants3 {
	5.7%  { transform: rotate(86deg); }
	6.3%  { transform: rotate(96deg); }
	6.6%  { transform: rotate(101deg); }
	6.9%  { transform: rotate(96deg); }
	7.2%  { transform: rotate(89deg); }
	7.5%  { transform: rotate(78deg); }
	7.8%  { transform: rotate(68deg); }
	8.1%  { transform: rotate(65deg); }
	8.4%  { transform: rotate(67deg); }
	8.7%  { transform: rotate(74deg); }
	9.0%  { transform: rotate(82deg); }
	9.3%  { transform: rotate(89deg); }
	9.6%  { transform: rotate(92deg); }
	9.9%  { transform: rotate(90deg); }
	10.2% { transform: rotate(86deg); }
	10.5% { transform: rotate(83deg); }
	10.8% { transform: rotate(82deg); }
	11.1% { transform: rotate(82deg); }
	11.4% { transform: rotate(83deg); }
	11.7% { transform: rotate(85deg); }
	12.0% { transform: rotate(88deg); }
	12.6% { transform: rotate(88deg); }
	12.9% { transform: rotate(87deg); }
	15.0% { transform: rotate(87deg); }
	15.3% { transform: rotate(86deg); }

	45.9% { transform: rotate(86deg); }
	46.2% { transform: rotate(89deg); }
	46.5% { transform: rotate(96deg); }
	46.8% { transform: rotate(100deg); }
	47.1% { transform: rotate(96deg); }
	47.4% { transform: rotate(88deg); }
	47.7% { transform: rotate(79deg); }
	48.0% { transform: rotate(69deg); }
	48.3% { transform: rotate(64deg); }
	48.6% { transform: rotate(67deg); }
	48.9% { transform: rotate(74deg); }
	49.2% { transform: rotate(81deg); }
	49.5% { transform: rotate(89deg); }
	49.8% { transform: rotate(91deg); }
	50.1% { transform: rotate(90deg); }
	50.4% { transform: rotate(86deg); }
	50.7% { transform: rotate(83deg); }
	51.0% { transform: rotate(82deg); }
	51.3% { transform: rotate(82deg); }
	51.6% { transform: rotate(84deg); }
	51.9% { transform: rotate(84deg); }
	52.2% { transform: rotate(87deg); }
	53.4% { transform: rotate(87deg); }
	53.7% { transform: rotate(86deg); }

	74.1% { transform: rotate(86deg); }
	74.4% { transform: rotate(89deg); }
	74.7% { transform: rotate(96deg); }
	75.0% { transform: rotate(100deg); }
	75.3% { transform: rotate(96deg); }
	75.6% { transform: rotate(90deg); }
	75.9% { transform: rotate(80deg); }
	76.2% { transform: rotate(70deg); }
	76.5% { transform: rotate(65deg); }
	76.8% { transform: rotate(67deg); }
	77.1% { transform: rotate(73deg); }
	77.4% { transform: rotate(81deg); }
	77.7% { transform: rotate(88deg); }
	78.0% { transform: rotate(90deg); }
	78.3% { transform: rotate(90deg); }
	78.6% { transform: rotate(86deg); }
	78.9% { transform: rotate(83deg); }
	79.2% { transform: rotate(81deg); }
	79.5% { transform: rotate(82deg); }
	79.8% { transform: rotate(83deg); }
	80.1% { transform: rotate(86deg); }
	80.4% { transform: rotate(88deg); }
	80.7% { transform: rotate(88deg); }
	81.0% { transform: rotate(87deg); }
	81.3% { transform: rotate(87deg); }
	81.6% { transform: rotate(87deg); }
	81.9% { transform: rotate(86deg); }
	83.1% { transform: rotate(86deg); }
	83.4% { transform: rotate(87deg); }
	83.7% { transform: rotate(87deg); }
	84.0% { transform: rotate(86deg); }
}
@keyframes plants4 {
	5.7%  { transform: rotate(112deg); }
	6.3%  { transform: rotate(122deg); }
	6.6%  { transform: rotate(118deg); }
	6.9%  { transform: rotate(106deg); }
	7.2%  { transform: rotate(94deg); }
	7.5%  { transform: rotate(88deg); }
	7.8%  { transform: rotate(85deg); }
	8.1%  { transform: rotate(89deg); }
	8.4%  { transform: rotate(97deg); }
	8.7%  { transform: rotate(105deg); }
	9.0%  { transform: rotate(111deg); }
	9.3%  { transform: rotate(113deg); }
	9.6%  { transform: rotate(113deg); }
	9.9%  { transform: rotate(109deg); }
	10.2% { transform: rotate(106deg); }
	10.5% { transform: rotate(106deg); }
	10.8% { transform: rotate(107deg); }
	11.1% { transform: rotate(110deg); }
	11.4% { transform: rotate(113deg); }
	11.7% { transform: rotate(116deg); }
	12.9% { transform: rotate(116deg); }
	13.2% { transform: rotate(114deg); }
	15.3% { transform: rotate(112deg); }

	45.9% { transform: rotate(112deg); }
	46.2% { transform: rotate(121deg); }
	46.5% { transform: rotate(121deg); }
	46.8% { transform: rotate(118deg); }
	47.1% { transform: rotate(106deg); }
	47.4% { transform: rotate(96deg); }
	47.7% { transform: rotate(88deg); }
	48.0% { transform: rotate(85deg); }
	48.3% { transform: rotate(89deg); }
	48.6% { transform: rotate(96deg); }
	48.9% { transform: rotate(105deg); }
	49.2% { transform: rotate(112deg); }
	49.5% { transform: rotate(114deg); }
	49.8% { transform: rotate(114deg); }
	50.1% { transform: rotate(109deg); }
	50.4% { transform: rotate(107deg); }
	51.0% { transform: rotate(107deg); }
	51.3% { transform: rotate(110deg); }
	51.6% { transform: rotate(113deg); }
	51.9% { transform: rotate(113deg); }
	52.2% { transform: rotate(116deg); }
	53.4% { transform: rotate(116deg); }
	53.7% { transform: rotate(113deg); }
	55.2% { transform: rotate(113deg); }
	55.5% { transform: rotate(112deg); }

	74.1% { transform: rotate(112deg); }
	74.4% { transform: rotate(120deg); }
	74.7% { transform: rotate(121deg); }
	75.0% { transform: rotate(118deg); }
	75.3% { transform: rotate(107deg); }
	75.6% { transform: rotate(95deg); }
	75.9% { transform: rotate(89deg); }
	76.2% { transform: rotate(86deg); }
	76.5% { transform: rotate(89deg); }
	76.8% { transform: rotate(95deg); }
	77.1% { transform: rotate(103deg); }
	77.4% { transform: rotate(112deg); }
	77.7% { transform: rotate(114deg); }
	78.0% { transform: rotate(114deg); }
	78.3% { transform: rotate(110deg); }
	78.6% { transform: rotate(108deg); }
	78.9% { transform: rotate(107deg); }
	79.2% { transform: rotate(108deg); }
	79.5% { transform: rotate(110deg); }
	79.8% { transform: rotate(113deg); }
	80.1% { transform: rotate(115deg); }
	80.4% { transform: rotate(117deg); }
	80.7% { transform: rotate(117deg); }
	81.0% { transform: rotate(115deg); }
	81.6% { transform: rotate(115deg); }
	81.9% { transform: rotate(114deg); }
	84.0% { transform: rotate(112deg); }
}
@keyframes plants5 {
	5.7%  { transform: rotate(26deg); }
	6.3%  { transform: rotate(50deg); }
	6.6%  { transform: rotate(59deg); }
	6.9%  { transform: rotate(55deg); }
	7.2%  { transform: rotate(45deg); }
	7.5%  { transform: rotate(31deg); }
	7.8%  { transform: rotate(19deg); }
	8.1%  { transform: rotate(15deg); }
	8.4%  { transform: rotate(18deg); }
	8.7%  { transform: rotate(26deg); }
	9.0%  { transform: rotate(35deg); }
	9.3%  { transform: rotate(41deg); }
	9.6%  { transform: rotate(44deg); }
	9.9%  { transform: rotate(41deg); }
	10.2% { transform: rotate(34deg); }
	10.5% { transform: rotate(25deg); }
	10.8% { transform: rotate(22deg); }
	11.1% { transform: rotate(24deg); }
	11.4% { transform: rotate(25deg); }
	11.7% { transform: rotate(28deg); }
	12.0% { transform: rotate(29deg); }
	12.3% { transform: rotate(29deg); }
	12.6% { transform: rotate(29deg); }
	12.9% { transform: rotate(27deg); }
	14.1% { transform: rotate(27deg); }
	14.4% { transform: rotate(25deg); }
	15.0% { transform: rotate(25deg); }
	15.3% { transform: rotate(26deg); }

	45.9% { transform: rotate(26deg); }
	46.2% { transform: rotate(35deg); }
	46.5% { transform: rotate(51deg); }
	46.8% { transform: rotate(42deg); }
	47.1% { transform: rotate(55deg); }
	47.4% { transform: rotate(45deg); }
	47.7% { transform: rotate(31deg); }
	48.0% { transform: rotate(20deg); }
	48.3% { transform: rotate(14deg); }
	48.6% { transform: rotate(18deg); }
	48.9% { transform: rotate(26deg); }
	49.2% { transform: rotate(35deg); }
	49.5% { transform: rotate(42deg); }
	49.8% { transform: rotate(44deg); }
	50.1% { transform: rotate(41deg); }
	50.4% { transform: rotate(34deg); }
	50.7% { transform: rotate(26deg); }
	51.0% { transform: rotate(23deg); }
	51.3% { transform: rotate(23deg); }
	51.6% { transform: rotate(25deg); }
	51.9% { transform: rotate(28deg); }
	52.8% { transform: rotate(28deg); }
	53.1% { transform: rotate(27deg); }
	53.4% { transform: rotate(27deg); }
	53.7% { transform: rotate(26deg); }

	74.1% { transform: rotate(26deg); }
	74.4% { transform: rotate(34deg); }
	74.7% { transform: rotate(50deg); }
	75.0% { transform: rotate(59deg); }
	75.3% { transform: rotate(56deg); }
	75.6% { transform: rotate(45deg); }
	75.9% { transform: rotate(31deg); }
	76.2% { transform: rotate(20deg); }
	76.5% { transform: rotate(16deg); }
	76.8% { transform: rotate(18deg); }
	77.1% { transform: rotate(28deg); }
	77.4% { transform: rotate(36deg); }
	77.7% { transform: rotate(42deg); }
	78.0% { transform: rotate(44deg); }
	78.3% { transform: rotate(41deg); }
	78.6% { transform: rotate(34deg); }
	78.9% { transform: rotate(26deg); }
	79.2% { transform: rotate(23deg); }
	79.5% { transform: rotate(23deg); }
	79.8% { transform: rotate(25deg); }
	80.1% { transform: rotate(27deg); }
	80.4% { transform: rotate(29deg); }
	80.7% { transform: rotate(29deg); }
	81.0% { transform: rotate(28deg); }
	81.3% { transform: rotate(28deg); }
	81.6% { transform: rotate(26deg); }
	81.9% { transform: rotate(26deg); }
	82.2% { transform: rotate(25deg); }
	82.5% { transform: rotate(26deg); }
	83.1% { transform: rotate(26deg); }
	83.4% { transform: rotate(25deg); }
}
@keyframes plants6 {
	5.7% { transform: rotate(0deg); }
	6.0% { transform: rotate(12deg); }
	6.3% { transform: rotate(21deg); }
	6.6% { transform: rotate(26deg); }
	6.9% { transform: rotate(22deg); }
	7.2% { transform: rotate(16deg); }
	7.5% { transform: rotate(8deg); }
	7.8% { transform: rotate(0deg); }
	8.1% { transform: rotate(-5deg); }
	8.4% { transform: rotate(-4deg); }
	8.7% { transform: rotate(3deg); }
	9.0% { transform: rotate(10deg); }
	9.3% { transform: rotate(15deg); }
	9.6% { transform: rotate(18deg); }
	9.9% { transform: rotate(18deg); }
	11.4% { transform: rotate(-4deg); }
	12.6% { transform: rotate(2deg); }
	14.4% { transform: rotate(0deg); }

	45.9% { transform: rotate(0deg); }
	46.2% { transform: rotate(12deg); }
	46.5% { transform: rotate(21deg); }
	46.8% { transform: rotate(26deg); }
	47.1% { transform: rotate(22deg); }
	47.4% { transform: rotate(16deg); }
	47.7% { transform: rotate(8deg); }
	48.0% { transform: rotate(0deg); }
	48.3% { transform: rotate(-5deg); }
	48.6% { transform: rotate(-4deg); }
	48.9% { transform: rotate(3deg); }
	49.2% { transform: rotate(10deg); }
	49.5% { transform: rotate(15deg); }
	50.1% { transform: rotate(18deg); }
	51.0% { transform: rotate(18deg); }
	52.5% { transform: rotate(-4deg); }
	53.7% { transform: rotate(2deg); }
	55.5% { transform: rotate(0deg); }

	74.1% { transform: rotate(0deg); }
	74.4% { transform: rotate(7deg); }
	74.7% { transform: rotate(21deg); }
	75.0% { transform: rotate(25deg); }
	75.3% { transform: rotate(24deg); }
	75.6% { transform: rotate(16deg); }
	75.9% { transform: rotate(5deg); }
	76.2% { transform: rotate(-6deg); }
	76.5% { transform: rotate(-13deg); }
	76.8% { transform: rotate(-11deg); }
	77.1% { transform: rotate(-3deg); }
	77.4% { transform: rotate(5deg); }
	77.7% { transform: rotate(13deg); }
	78.0% { transform: rotate(18deg); }
	78.3% { transform: rotate(19deg); }
	78.6% { transform: rotate(17deg); }
	78.9% { transform: rotate(14deg); }
	79.2% { transform: rotate(10deg); }
	79.5% { transform: rotate(4deg); }
	79.8% { transform: rotate(0deg); }
	80.1% { transform: rotate(-2deg); }
	80.4% { transform: rotate(-1deg); }
	80.7% { transform: rotate(2deg); }
	81.0% { transform: rotate(4deg); }
	81.3% { transform: rotate(7deg); }
	81.6% { transform: rotate(9deg); }
	81.9% { transform: rotate(10deg); }
	82.2% { transform: rotate(9deg); }
	82.5% { transform: rotate(7deg); }
	82.8% { transform: rotate(3deg); }
	83.1% { transform: rotate(1deg); }
	83.4% { transform: rotate(-2deg); }
	83.7% { transform: rotate(-1deg); }
	84.0% { transform: rotate(0deg); }
}

@keyframes skulp {
	41.7% { transform: rotate(0deg); }
	42.6% { transform: rotate(-70deg); }
	43.2% { transform: rotate(-57deg); }
	43.8% { transform: rotate(-71deg); }
	44.7% { transform: rotate(-72deg); }
	45.9% { transform: rotate(-72deg); }
	46.8% { transform: rotate(0deg); }
	47.4% { transform: rotate(-5deg); }
	48.0% { transform: rotate(0deg); }
	48.6% { transform: rotate(-2deg); }
	49.2% { transform: rotate(0deg); }
	67.2% { transform: rotate(0deg); }
	68.1% { transform: rotate(-70deg); }
	68.7% { transform: rotate(-57deg); }
	69.3% { transform: rotate(-71deg); }
	70.2% { transform: rotate(-72deg); }
	71.4% { transform: rotate(-72deg); }
	72.3% { transform: rotate(0deg); }
	72.9% { transform: rotate(-5deg); }
	73.5% { transform: rotate(0deg); }
	74.1% { transform: rotate(-2deg); }
	74.7% { transform: rotate(0deg); }
}

@keyframes bat {
	0%  { transform: rotate(10deg) scaleY(1.05); }
	25% { transform: rotate(0deg) scaleY(0.8); }
	50% { transform: rotate(-10deg) scaleY(1.05); }
	75% { transform: rotate(0deg) scaleY(0.8); }
	100%{ transform: rotate(10deg) scaleY(1.05); }
}
@keyframes batEye {
	95% { transform: scaleY(1); }
	98% { transform: scaleY(0); }
	100%{ transform: scaleY(1); }
}

@keyframes leaf {
	0.0%  { transform: rotate(0deg); }
	4.5%  { transform: rotate(27deg); }
	4.8%  { transform: rotate(-22deg); }
	5.4%  { transform: rotate(0deg); }
	5.7%  { transform: rotate(-8deg); }
	6.6%  { transform: rotate(18deg); }
	12.0% { transform: rotate(2deg); }
	18.0% { transform: rotate(15deg); }
	24.0% { transform: rotate(2deg); }
	30.0% { transform: rotate(17deg); }
	37.5% { transform: rotate(0deg); }
	42.0% { transform: rotate(18deg); }
	44.7% { transform: rotate(0deg); }
	45.0% { transform: rotate(-20deg); }
	45.3% { transform: rotate(10deg); }
	45.9% { transform: rotate(-20deg); }
	46.5% { transform: rotate(16deg); }
	50.4% { transform: rotate(0deg); }
	55.5% { transform: rotate(15deg); }
	60.0% { transform: rotate(0deg); }
	66.6% { transform: rotate(17deg); }
	71.7% { transform: rotate(0deg); }
	72.0% { transform: rotate(-35deg); }
	72.3% { transform: rotate(14deg); }
	72.6% { transform: rotate(-30deg); }
	72.9% { transform: rotate(6deg); }
	73.5% { transform: rotate(-14deg); }
	73.8% { transform: rotate(4deg); }
	74.1% { transform: rotate(-7deg); }
	79.8% { transform: rotate(15deg); }
	85.2% { transform: rotate(0deg); }
	92.4% { transform: rotate(18deg); }
	100%  { transform: rotate(0deg); }
}

@keyframes monster1 {
	0.0%  { transform: rotate(-15deg) translate(-20px, 2px); }
	5.4%  { transform: rotate(-18deg) translate(-20px, 2px); }
	7.2%  { transform: rotate(-20deg) translate(-4px, -5px); }
	9.9%  { transform: rotate(-4deg) translate(8px, 20px); }
	17.7% { transform: rotate(-19deg) translate(11px, -3px); }
	23.7% { transform: rotate(-22deg) translate(1px, -1px); }
	26.7% { transform: rotate(-18deg) translate(-1px, 1px); }
	30.9% { transform: rotate(-19deg) translate(-1px, -6px); }
	33.3% { transform: rotate(-21deg) translate(-1px, 0px); }
	37.8% { transform: rotate(-17deg) translate(1px, 2px); }
	41.4% { transform: rotate(-21deg) translate(0px, 1px); }
	45.0% { transform: rotate(-19deg) translate(2px, 3px); }
	47.7% { transform: rotate(-24deg) translate(3px, -5px); }
	50.4% { transform: rotate(-10deg) translate(4px, 20px); }
	54.6% { transform: rotate(-17deg) translate(12px, 13px); }
	59.1% { transform: rotate(-22deg) translate(0px, -10px); }
	64.2% { transform: rotate(-17deg) translate(-10px, -1px); }
	68.1% { transform: rotate(-20deg) translate(-9px, -3px); }
	75.9% { transform: rotate(-24deg) translate(2px, -5px); }
	78.5% { transform: rotate(-7deg) translate(0px, 22px); }
	84.6% { transform: rotate(-21deg) translate(-7px, -11px); }
	90.0% { transform: rotate(-20deg) translate(-7px, -7px); }
	93.9% { transform: rotate(-16deg) translate(0px, 0px); }
	100%  { transform: rotate(-15deg) translate(-20px, 2px); }
}
@keyframes monster1Eyes {
	12.6% { transform: scaleY(1); }
	13.2% { transform: scaleY(0); }
	13.8% { transform: scaleY(1); }

	16.8% { transform: scaleY(1); }
	17.6% { transform: scaleY(0); }
	18.3% { transform: scaleY(1); }

	26.7% { transform: scaleY(1); }
	27.3% { transform: scaleY(0); }
	27.9% { transform: scaleY(1); }

	32.4% { transform: scaleY(1); }
	33.0% { transform: scaleY(0); }
	33.6% { transform: scaleY(1); }

	41.4% { transform: scaleY(1); }
	42.1% { transform: scaleY(0); }
	42.9% { transform: scaleY(1); }

	54.6% { transform: scaleY(1); }
	55.4% { transform: scaleY(0); }
	56.1% { transform: scaleY(1); }

	60.6% { transform: scaleY(1); }
	61.2% { transform: scaleY(0); }
	61.8% { transform: scaleY(1); }

	64.2% { transform: scaleY(1); }
	65.0% { transform: scaleY(0); }
	65.7% { transform: scaleY(1); }

	71.7% { transform: scaleY(1); }
	72.3% { transform: scaleY(0); }
	73.2% { transform: scaleY(1); }

	90.3% { transform: scaleY(1); }
	90.0% { transform: scaleY(0); }
	91.8% { transform: scaleY(1); }
}
@keyframes monster2 {
	0.0%  { transform: rotate(15deg) translate(-4px, 0px); }
	5.4%  { transform: rotate(15deg) translate(13px, -11px); }
	7.2%  { transform: rotate(15deg) translate(26px, -14px); }
	9.9%  { transform: rotate(4deg) translate(-3px, -3px); }
	17.7% { transform: rotate(8deg) translate(15px, -7px); }
	23.7% { transform: rotate(2deg) translate(1px, 2px); }
	26.7% { transform: rotate(2deg) translate(0px, -2px); }
	30.9% { transform: rotate(8deg) translate(1px, -2px); }
	33.3% { transform: rotate(13deg) translate(-2px, 1px); }
	37.8% { transform: rotate(16deg) translate(-8px, -5px); }
	41.4% { transform: rotate(13deg) translate(-4px, -3px); }
	45.0% { transform: rotate(19deg) translate(6px, 2px); }
	47.7% { transform: rotate(19deg) translate(29px, -15px); }
	50.4% { transform: rotate(9deg) translate(-1px, -4px); }
	54.6% { transform: rotate(2deg) translate(1px, -4px); }
	59.1% { transform: rotate(7deg) translate(15px, -8px); }
	64.2% { transform: rotate(5deg) translate(11px, -4px); }
	68.1% { transform: rotate(11deg) translate(28px, -10px); }
	75.9% { transform: rotate(16deg) translate(24px, -15px); }
	78.6% { transform: rotate(3deg) translate(-6px, -3px); }
	84.6% { transform: rotate(2deg) translate(10px, -14px); }
	90.0% { transform: rotate(6deg) translate(-7px, -10px); }
	93.9% { transform: rotate(15deg) translate(0px, 0px); }
	100%  { transform: rotate(15deg) translate(-4px, 0px); }
}
@keyframes monster2Eyes {
	6.0%  { transform: scaleY(1); }
	6.6%  { transform: scaleY(0); }
	7.2%  { transform: scaleY(1); }

	9.3%  { transform: scaleY(1); }
	9.9%  { transform: scaleY(0); }
	10.5% { transform: scaleY(1); }

	17.4% { transform: scaleY(1); }
	18.2% { transform: scaleY(0); }
	18.9% { transform: scaleY(1); }

	22.8% { transform: scaleY(1); }
	23.5% { transform: scaleY(0); }
	24.3% { transform: scaleY(1); }

	35.7% { transform: scaleY(1); }
	36.5% { transform: scaleY(0); }
	37.2% { transform: scaleY(1); }

	57.9% { transform: scaleY(1); }
	58.5% { transform: scaleY(0); }
	59.1% { transform: scaleY(1); }

	66.9% { transform: scaleY(1); }
	67.1% { transform: scaleY(0); }
	68.4% { transform: scaleY(1); }

	81.0% { transform: scaleY(1); }
	81.6% { transform: scaleY(0); }
	82.2% { transform: scaleY(1); }

	83.7% { transform: scaleY(1); }
	84.6% { transform: scaleY(0); }
	85.5% { transform: scaleY(1); }
}

@keyframes alchemistHead {
	0.0%  { transform: rotate(6deg) translate(3px, 12px); }
	2.7%  { transform: rotate(4deg) translate(7px, -9px); }
	5.7%  { transform: rotate(0deg) translate(0px, 3px); }
	7.2%  { transform: rotate(0deg) translate(-5px, 12px); }
	8.7%  { transform: rotate(0deg) translate(1px, -1px); }
	12.3% { transform: rotate(4deg) translate(18px, -2px); }
	14.7% { transform: rotate(0deg) translate(0px, -1px); }
	17.7% { transform: rotate(-2deg) translate(-10px, -3px); }
	19.5% { transform: rotate(-3deg) translate(-9px, -1px); }
	22.2% { transform: rotate(0deg) translate(0px, -7px); }
	24.0% { transform: rotate(0deg) translate(-1px, -13px); }
	24.9% { transform: rotate(0deg) translate(1px, -8px); }
	25.8% { transform: rotate(0deg) translate(3px, 3px); }
	27.9% { transform: rotate(6deg) translate(19px, 10px); }
	30.3% { transform: rotate(2deg) translate(10px, 13px); }
	31.8% { transform: rotate(1deg) translate(3px, 4px); }
	33.6% { transform: rotate(0deg) translate(1px, -10px); }
	36.3% { transform: rotate(-3deg) translate(-11px, 1px); }
	38.4% { transform: rotate(-4deg) translate(-15px, 8px); }
	39.3% { transform: rotate(-5deg) translate(-10px, 7px); }
	40.8% { transform: rotate(0deg) translate(4px, -2px); }
	41.1% { transform: rotate(0deg) translate(0px, 1px); }
	42.0% { transform: rotate(6deg) translate(4px, 11px); }
	43.5% { transform: rotate(6deg) translate(4px, -2px); }
	44.4% { transform: rotate(4deg) translate(5px, -10px); }
	48.0% { transform: rotate(0deg) translate(1px, -1px); }
	54.0% { transform: rotate(0deg) translate(1px, -1px); }
	56.4% { transform: rotate(-2deg) translate(-13px, -1px); }
	57.6% { transform: rotate(-2deg) translate(-1px, -1px); }
	59.7% { transform: rotate(-2deg) translate(-10px, -2px); }
	62.1% { transform: rotate(0deg) translate(3px, -2px); }
	63.9% { transform: rotate(0deg) translate(-4px, -2px); }
	64.5% { transform: rotate(-3deg) translate(-8px, -3px); }
	65.1% { transform: rotate(-3deg) translate(-8px, -3px); }
	65.4% { transform: rotate(-2deg) translate(-5px, -3px); }
	66.6% { transform: rotate(0deg) translate(6px, -2px); }
	67.5% { transform: rotate(3deg) translate(3px, 11px); }
	68.7% { transform: rotate(6deg) translate(3px, 6px); }
	70.2% { transform: rotate(5deg) translate(7px, -9px); }
	71.4% { transform: rotate(0deg) translate(0px, -3px); }
	75.9% { transform: rotate(0deg) translate(7px, 3px); }
	77.4% { transform: rotate(0deg) translate(0px, -7px); }
	81.0% { transform: rotate(0deg) translate(8px, -5px); }
	83.4% { transform: rotate(0deg) translate(2px, -5px); }
	86.1% { transform: rotate(-2deg) translate(-12px, -5px); }
	86.7% { transform: rotate(-2deg) translate(-12px, -5px); }
	87.6% { transform: rotate(0deg) translate(0px, -7px); }
	89.4% { transform: rotate(4deg) translate(11px, -13px); }
	91.2% { transform: rotate(2deg) translate(-1px, -13px); }
	93.3% { transform: rotate(2deg) translate(15px, -14px); }
	93.9% { transform: rotate(2deg) translate(15px, -14px); }
	94.8% { transform: rotate(2deg) translate(10px, -11px); }
	96.0% { transform: rotate(0deg) translate(1px, -4px); }
	97.8% { transform: rotate(0deg) translate(4px, -4px); }
	100%  { transform: rotate(6deg) translate(3px, 12px); }
}
@keyframes alchemistHat {
	0.0%  { transform: translate(21px, 27px) rotate(7deg); }
	2.7%  { transform: translate(23px, 4px) rotate(6deg); }
	5.7%  { transform: translate(-3px, 3px) rotate(0deg); }
	7.2%  { transform: translate(-10px, 11px) rotate(0deg); }
	8.7%  { transform: translate(1px, 4px) rotate(0deg); }
	12.3% { transform: translate(27px, 10px) rotate(6deg); }
	14.7% { transform: translate(3px, 1px) rotate(0deg); }
	17.7% { transform: translate(-8px, -5px) rotate(-1deg); }
	19.5% { transform: translate(-10px, -5px) rotate(-3deg); }
	22.2% { transform: translate(1px, -4px) rotate(0deg); }
	24.0% { transform: translate(-21px, -13px) rotate(0deg); }
	24.9% { transform: translate(1px, -6px) rotate(0deg); }
	25.8% { transform: translate(25px, 6px) rotate(0deg); }
	27.9% { transform: translate(25px, 23px) rotate(6deg); }
	30.3% { transform: translate(13px, 23px) rotate(4deg); }
	31.8% { transform: translate(1px, 7px) rotate(1deg); }
	33.6% { transform: translate(-3px, -9px) rotate(1deg); }
	36.3% { transform: translate(-12px, -4px) rotate(-2deg); }
	38.4% { transform: translate(-25px, 7px) rotate(-5deg); }
	39.3% { transform: translate(-19px, 10px) rotate(-5deg); }
	40.8% { transform: translate(5px, 1px) rotate(1deg); }
	41.1% { transform: translate(4px, 4px) rotate(1deg); }
	42.0% { transform: translate(24px, 27px) rotate(5deg); }
	43.5% { transform: translate(24px, 14px) rotate(6deg); }
	44.4% { transform: translate(31px, 10px) rotate(6deg); }
	48.0% { transform: translate(-2px, 1px) rotate(0deg); }
	49.8% { transform: translate(-2px, 1px) rotate(0deg); }
	53.1% { transform: translate(7px, 1px) rotate(0deg); }
	54.0% { transform: translate(7px, 1px) rotate(0deg); }
	56.4% { transform: translate(-36px, -1px) rotate(-5deg); }
	57.6% { transform: translate(-9px, -1px) rotate(0deg); }
	59.7% { transform: translate(-6px, -5px) rotate(0deg); }
	62.1% { transform: translate(1px, 0px) rotate(0deg); }
	63.9% { transform: translate(-23px, 0px) rotate(0deg); }
	64.5% { transform: translate(-31px, -2px) rotate(-2deg); }
	65.4% { transform: translate(-31px, -2px) rotate(-2deg); }
	66.6% { transform: translate(4px, 2px) rotate(0deg); }
	67.5% { transform: translate(8px, 17px) rotate(2deg); }
	68.7% { transform: translate(20px, 20px) rotate(6deg); }
	70.2% { transform: translate(18px, 3px) rotate(5deg); }
	71.4% { transform: translate(-1px, -2px) rotate(0deg); }
	75.9% { transform: translate(8px, 7px) rotate(0deg); }
	77.4% { transform: translate(0px, 6px) rotate(0deg); }
	81.0% { transform: translate(9px, 1px) rotate(0deg); }
	83.4% { transform: translate(-9px, -2px) rotate(0deg); }
	86.1% { transform: translate(-37px, -5px) rotate(-3deg); }
	86.7% { transform: translate(-37px, -5px) rotate(-3deg); }
	87.6% { transform: translate(-23px, -5px) rotate(-2deg); }
	89.4% { transform: translate(16px, -5px) rotate(3deg); }
	91.2% { transform: translate(-2px, -10px) rotate(0deg); }
	93.3% { transform: translate(23px, -4px) rotate(3deg); }
	93.9% { transform: translate(23px, -4px) rotate(3deg); }
	94.8% { transform: translate(26px, -2px) rotate(3deg); }
	96.0% { transform: translate(7px, -1px) rotate(1deg); }
	97.8% { transform: translate(7px, -1px) rotate(1deg); }
	100%  { transform: translate(21px, 27px) rotate(7deg); }
}
@keyframes alchemistLeftEar {
	0.0%  { transform: translate(14px, 0px) rotate(46deg); }
	2.7%  { transform: translate(16px, 3px) rotate(38deg); }
	5.7%  { transform: translate(-1px, 2px) rotate(45deg); }
	7.2%  { transform: translate(-1px, 5px) rotate(41deg); }
	8.7%  { transform: translate(2px, 7px) rotate(45deg); }
	12.3% { transform: translate(3px, -1px) rotate(45deg); }
	14.7% { transform: translate(3px, 1px) rotate(45deg); }
	17.7% { transform: translate(11px, 5px) rotate(42deg); }
	19.5% { transform: translate(13px, 3px) rotate(42deg); }
	22.2% { transform: translate(2px, 2px) rotate(45deg); }
	24.0% { transform: translate(2px, 2px) rotate(45deg); }
	24.9% { transform: translate(1px, 3px) rotate(45deg); }
	25.8% { transform: translate(28px, 2px) rotate(52deg); }
	27.9% { transform: translate(0px, 2px) rotate(40deg); }
	30.3% { transform: translate(1px, 3px) rotate(46deg); }
	31.8% { transform: translate(1px, 3px) rotate(46deg); }
	33.6% { transform: translate(6px, 1px) rotate(46deg); }
	36.3% { transform: translate(4px, 3px) rotate(44deg); }
	38.4% { transform: translate(-3px, 5px) rotate(44deg); }
	39.3% { transform: translate(0px, 6px) rotate(44deg); }
	40.8% { transform: translate(2px, 0px) rotate(47deg); }
	41.1% { transform: translate(2px, 0px) rotate(47deg); }
	42.0% { transform: translate(18px, 3px) rotate(45deg); }
	43.5% { transform: translate(18px, 3px) rotate(45deg); }
	44.4% { transform: translate(28px, 3px) rotate(45deg); }
	48.0% { transform: translate(0px, 3px) rotate(45deg); }
	49.8% { transform: translate(0px, 3px) rotate(45deg); }
	53.1% { transform: translate(10px, 4px) rotate(45deg); }
	54.0% { transform: translate(10px, 4px) rotate(45deg); }
	56.4% { transform: translate(0px, 7px) rotate(45deg); }
	57.6% { transform: translate(1px, -1px) rotate(45deg); }
	59.7% { transform: translate(21px, 3px) rotate(45deg); }
	62.1% { transform: translate(-1px, 1px) rotate(45deg); }
	63.9% { transform: translate(3px, 3px) rotate(45deg); }
	65.4% { transform: translate(3px, 3px) rotate(45deg); }
	66.6% { transform: translate(0px, 2px) rotate(45deg); }
	67.5% { transform: translate(0px, 2px) rotate(45deg); }
	68.7% { transform: translate(14px, 2px) rotate(45deg); }
	70.2% { transform: translate(2px, 0px) rotate(45deg); }
	71.4% { transform: translate(0px, 4px) rotate(45deg); }
	75.9% { transform: translate(3px, 1px) rotate(45deg); }
	77.4% { transform: translate(1px, 13px) rotate(45deg); }
	81.0% { transform: translate(2px, 0px) rotate(45deg); }
	83.4% { transform: translate(2px, 0px) rotate(45deg); }
	86.1% { transform: translate(2px, 5px) rotate(45deg); }
	89.4% { transform: translate(2px, 5px) rotate(45deg); }
	91.2% { transform: translate(0px, 6px) rotate(44deg); }
	93.3% { transform: translate(3px, 0px) rotate(45deg); }
	93.9% { transform: translate(3px, 0px) rotate(45deg); }
	94.8% { transform: translate(15px, 0px) rotate(45deg); }
	96.0% { transform: translate(10px, 3px) rotate(45deg); }
	97.8% { transform: translate(1px, 3px) rotate(45deg); }
	100%  { transform: translate(14px, 0px) rotate(46deg); }
}
@keyframes alchemistBeard {
	0.0%  { transform: translate(-13px, 0px); }
	2.7%  { transform: translate(-12px, 0px); }
	5.7%  { transform: translate(1px, 0px); }
	8.7%  { transform: translate(1px, 0px); }
	12.3% { transform: translate(-2px, 0px); }
	14.7% { transform: translate(-2px, 0px); }
	17.7% { transform: translate(-13px, 0px); }
	19.5% { transform: translate(-16px, 0px); }
	22.2% { transform: translate(1px, 0px); }
	24.0% { transform: translate(18px, 0px); }
	24.9% { transform: translate(3px, 0px); }
	25.8% { transform: translate(-16px, 0px); }
	27.9% { transform: translate(2px, 0px); }
	30.3% { transform: translate(2px, 0px); }
	31.8% { transform: translate(11px, 0px); }
	33.6% { transform: translate(-5px, 0px); }
	36.3% { transform: translate(-1px, 0px); }
	38.4% { transform: translate(5px, 0px); }
	39.3% { transform: translate(0px, 0px); }
	41.1% { transform: translate(0px, 0px); }
	42.0% { transform: translate(-13px, 0px); }
	43.5% { transform: translate(-13px, 0px); }
	44.4% { transform: translate(-20px, 0px); }
	48.0% { transform: translate(2px, 0px); }
	49.8% { transform: translate(2px, 0px); }
	53.1% { transform: translate(-9px, 0px); }
	54.0% { transform: translate(-9px, 0px); }
	56.4% { transform: translate(20px, 0px); }
	57.6% { transform: translate(-1px, 0px); }
	59.7% { transform: translate(-14px, 0px); }
	62.1% { transform: translate(-1px, 0px); }
	63.9% { transform: translate(5px, 0px); }
	64.5% { transform: translate(15px, 0px); }
	67.5% { transform: translate(15px, 0px); }
	68.7% { transform: translate(-10px, 0px); }
	70.2% { transform: translate(-2px, 0px); }
	71.4% { transform: translate(-2px, 0px); }
	75.9% { transform: translate(0px, 0px); }
	81.0% { transform: translate(0px, 0px); }
	83.4% { transform: translate(13px, 0px); }
	87.6% { transform: translate(13px, 0px); }
	89.4% { transform: translate(5px, 0px); }
	93.9% { transform: translate(5px, 0px); }
	94.8% { transform: translate(-10px, 0px); }
	96.0% { transform: translate(-10px, 0px); }
	97.8% { transform: translate(0px, 0px); }
	100%  { transform: translate(-13px, 0px); }
}
@keyframes alchemistMustache {
	0.0%  { transform: translate(-10px, 0px) scaleX(0.85); }
	2.7%  { transform: translate(-14px, 0px) scaleX(0.85); }
	5.7%  { transform: translate(2px, 0px) scaleX(1); }
	7.2%  { transform: translate(3px, 0px) scaleX(1); }
	8.7%  { transform: translate(1px, -6px) scaleX(1); }
	12.3% { transform: translate(0px, -2px) scaleX(1); }
	14.7% { transform: translate(-2px, 0px) scaleX(1); }
	17.7% { transform: translate(-12px, 2px) scaleX(0.9); }
	19.5% { transform: translate(-14px, 2px) scaleX(0.9); }
	22.2% { transform: translate(1px, 0px) scaleX(1); }
	24.0% { transform: translate(43px, 3px) scaleX(0.7); }
	24.9% { transform: translate(3px, 2px) scaleX(1); }
	25.8% { transform: translate(-29px, 1px) scaleX(0.7); }
	27.9% { transform: translate(2px, 1px) scaleX(1); }
	30.3% { transform: translate(4px, 3px) scaleX(1); }
	31.8% { transform: translate(12px, 2px) scaleX(1); }
	33.6% { transform: translate(-3px, 2px) scaleX(0.9); }
	36.3% { transform: translate(-2px, 1px) scaleX(1); }
	38.4% { transform: translate(8px, -4px) scaleX(1); }
	39.3% { transform: translate(1px, -16px) scaleX(1); }
	40.8% { transform: translate(4px, 1px) scaleX(1); }
	41.1% { transform: translate(4px, 1px) scaleX(1); }
	42.0% { transform: translate(-17px, 2px) scaleX(0.8); }
	43.5% { transform: translate(-17px, 2px) scaleX(0.8); }
	44.4% { transform: translate(-29px, -9px) scaleX(0.7); }
	48.0% { transform: translate(6px, 0px) scaleX(1); }
	49.8% { transform: translate(-2px, -6px) scaleX(1); }
	53.1% { transform: translate(-12px, -3px) scaleX(0.8); }
	54.0% { transform: translate(-12px, -3px) scaleX(0.8); }
	56.4% { transform: translate(36px, -3px) scaleX(0.8); }
	57.6% { transform: translate(3px, -2px) scaleX(1); }
	59.7% { transform: translate(-23px, 2px) scaleX(0.7); }
	62.1% { transform: translate(-1px, 2px) scaleX(1); }
	63.9% { transform: translate(40px, 2px) scaleX(0.8); }
	65.4% { transform: translate(40px, 2px) scaleX(0.8); }
	66.6% { transform: translate(3px, 1px) scaleX(1); }
	67.5% { transform: translate(3px, 1px) scaleX(1); }
	68.7% { transform: translate(-12px, 1px) scaleX(0.8); }
	70.2% { transform: translate(-2px, 1px) scaleX(1); }
	71.4% { transform: translate(-2px, 1px) scaleX(1); }
	75.9% { transform: translate(4px, 1px) scaleX(1); }
	77.4% { transform: translate(4px, -20px) scaleX(1); }
	81.0% { transform: translate(4px, 3px) scaleX(1); }
	83.4% { transform: translate(36px, 4px) scaleX(0.8); }
	86.1% { transform: translate(42px, 4px) scaleX(0.7); }
	87.6% { transform: translate(42px, 4px) scaleX(0.7); }
	89.4% { transform: translate(8px, 4px) scaleX(1); }
	91.2% { transform: translate(6px, 4px) scaleX(1); }
	93.3% { transform: translate(1px, 2px) scaleX(1); }
	93.9% { transform: translate(1px, 2px) scaleX(1); }
	94.8% { transform: translate(-12px, 1px) scaleX(0.8); }
	96.0% { transform: translate(-9px, 3px) scaleX(0.9); }
	97.8% { transform: translate(4px, 3px) scaleX(1); }
	100%  { transform: translate(-10px, 0px) scaleX(0.85); }
}
@keyframes alchemistRightEar {
	7.2%  { transform: rotate(-46deg) translate(-3px, -4px); }
	8.7%  { transform: rotate(-46deg) translate(-5px, 5px); }
	12.3% { transform: rotate(-46deg) translate(-2px, 5px); }
	14.7% { transform: rotate(-46deg) translate(-2px, 0px); }
	17.7% { transform: rotate(-46deg) translate(-4px, -2px); }
	19.5% { transform: rotate(-46deg) translate(-4px, -2px); }
	22.2% { transform: rotate(-46deg) translate(-3px, 0px); }
	24.0% { transform: rotate(-51deg) translate(-18px, -19px); }
	24.9% { transform: rotate(-45deg) translate(-5px, 2px); }
	25.8% { transform: rotate(-45deg) translate(-5px, 2px); }
	27.9% { transform: rotate(-48deg) translate(-5px, -1px); }
	30.3% { transform: rotate(-46deg) translate(-7px, 2px); }
	31.8% { transform: rotate(-50deg) translate(-7px, -5px); }
	33.6% { transform: rotate(-44deg) translate(-5px, -5px); }
	36.3% { transform: rotate(-44deg) translate(-3px, 0px); }
	38.4% { transform: rotate(-46deg) translate(-6px, -1px); }
	39.3% { transform: rotate(-45deg) translate(-9px, 5px); }
	40.8% { transform: rotate(-45deg) translate(-6px, 2px); }
	42.0% { transform: rotate(-45deg) translate(-6px, 2px); }
	43.5% { transform: rotate(-45deg) translate(-6px, -1px); }
	44.4% { transform: rotate(-45deg) translate(-9px, 5px); }
	48.0% { transform: rotate(-45deg) translate(-7px, -4px); }
	49.8% { transform: rotate(-45deg) translate(-5px, 1px); }
	53.1% { transform: rotate(-45deg) translate(-5px, -1px); }
	54.0% { transform: rotate(-45deg) translate(-5px, -1px); }
	56.4% { transform: rotate(-45deg) translate(-18px, -19px); }
	57.6% { transform: rotate(-45deg) translate(-4px, 1px); }
	59.7% { transform: rotate(-45deg) translate(-6px, -2px); }
	62.1% { transform: rotate(-45deg) translate(-4px, 0px); }
	63.9% { transform: rotate(-45deg) translate(-21px, -14px); }
	65.4% { transform: rotate(-45deg) translate(-21px, -14px); }
	66.6% { transform: rotate(-45deg) translate(-6px, -2px); }
	67.5% { transform: rotate(-45deg) translate(-3px, 3px); }
	68.7% { transform: rotate(-46deg) translate(-5px, 0px); }
	70.2% { transform: rotate(-46deg) translate(-5px, 0px); }
	71.4% { transform: rotate(-46deg) translate(-3px, 1px); }
	75.9% { transform: rotate(-46deg) translate(-3px, 1px); }
	77.4% { transform: rotate(-46deg) translate(-10px, 6px); }
	81.0% { transform: rotate(-46deg) translate(-8px, 1px); }
	83.4% { transform: rotate(-46deg) translate(-18px, -14px); }
	89.4% { transform: rotate(-46deg) translate(-18px, -14px); }
	91.2% { transform: rotate(-46deg) translate(-6px, -5px); }
	93.3% { transform: rotate(-46deg) translate(-6px, 4px); }
	93.9% { transform: rotate(-46deg) translate(-6px, 4px); }
	94.8% { transform: rotate(-45deg) translate(-4px, 3px); }
	96.0% { transform: rotate(-45deg) translate(-5px, 1px); }
	97.8% { transform: rotate(-45deg) translate(-5px, 1px); }
}
@keyframes alchemistСheeks {
	0.0%  { transform: translate(-4px, 0px); }
	2.7%  { transform: translate(-4px, 0px); box-shadow: 65px 0 0 0 #f7857c; }
	5.7%  { transform: translate(1px, 0px); box-shadow: 81px 0 0 0 #f7857c; }
	7.2%  { transform: translate(0px, 0px); box-shadow: 81px 0 0 0 #f7857c; }
	8.7%  { transform: translate(1px, -8px); box-shadow: 81px 0 0 0 #f7857c; }
	12.3% { transform: translate(0px, -3px); box-shadow: 81px 0 0 0 #f7857c; }
	14.7% { transform: translate(0px, 0px); box-shadow: 78px 0 0 0 #f7857c; }
	17.7% { transform: translate(-4px, 3px); box-shadow: 67px 0 0 0 #f7857c; }
	19.5% { transform: translate(-5px, 0px); box-shadow: 67px 0 0 0 #f7857c; }
	22.2% { transform: translate(1px, 0px); box-shadow: 80px 0 0 0 #f7857c; }
	24.0% { transform: translate(41px, 0px); box-shadow: 45px 0 0 0 #f7857c; }
	24.9% { transform: translate(2px, 2px); box-shadow: 81px 0 0 0 #f7857c; }
	25.8% { transform: translate(-5px, 2px); box-shadow: 44px 0 0 0 #f7857c; }
	27.9% { transform: translate(1px, 2px); box-shadow: 80px 0 0 0 #f7857c; }
	30.3% { transform: translate(4px, 2px); box-shadow: 77px 0 0 0 #f7857c; }
	31.8% { transform: translate(13px, 0px); box-shadow: 69px 0 0 0 #f7857c; }
	33.6% { transform: translate(0px, 1px); box-shadow: 73px 0 0 0 #f7857c; }
	36.3% { transform: translate(0px, 1px); box-shadow: 79px 0 0 0 #f7857c; }
	38.4% { transform: translate(6px, -4px); box-shadow: 77px 0 0 0 #f7857c; }
	39.3% { transform: translate(1px, -20px); box-shadow: 81px 0 0 0 #f7857c; }
	40.8% { transform: translate(5px, 0px); box-shadow: 78px 0 0 0 #f7857c; }
	41.1% { transform: translate(5px, 0px); box-shadow: 78px 0 0 0 #f7857c; }
	42.0% { transform: translate(-5px, 0px); box-shadow: 61px 0 0 0 #f7857c; }
	43.5% { transform: translate(-5px, 0px); box-shadow: 61px 0 0 0 #f7857c; }
	44.4% { transform: translate(-4px, -11px); box-shadow: 43px 0 0 0 #f7857c; }
	48.0% { transform: translate(6px, -1px); box-shadow: 76px 0 0 0 #f7857c; }
	49.8% { transform: translate(-2px, -7px); box-shadow: 80px 0 0 0 #f7857c; }
	53.1% { transform: translate(-3px, -4px); box-shadow: 66px 0 0 0 #f7857c; }
	54.0% { transform: translate(-3px, -4px); box-shadow: 66px 0 0 0 #f7857c; }
	56.4% { transform: translate(35px, -5px); box-shadow: 50px 0 0 0 #f7857c; }
	57.6% { transform: translate(2px, -3px); box-shadow: 80px 0 0 0 #f7857c; }
	59.7% { transform: translate(-4px, 1px); box-shadow: 51px 0 0 0 #f7857c; }
	62.1% { transform: translate(0px, 1px); box-shadow: 80px 0 0 0 #f7857c; }
	63.9% { transform: translate(41px, 1px); box-shadow: 45px 0 0 0 #f7857c; }
	65.4% { transform: translate(41px, 1px); box-shadow: 45px 0 0 0 #f7857c; }
	66.6% { transform: translate(2px, 1px); box-shadow: 79px 0 0 0 #f7857c; }
	67.5% { transform: translate(2px, 1px); box-shadow: 79px 0 0 0 #f7857c; }
	68.7% { transform: translate(-4px, -1px); box-shadow: 66px 0 0 0 #f7857c; }
	70.2% { transform: translate(-1px, -1px); box-shadow: 81px 0 0 0 #f7857c; }
	71.4% { transform: translate(-1px, -1px); box-shadow: 81px 0 0 0 #f7857c; }
	75.9% { transform: translate(5px, -1px); box-shadow: 77px 0 0 0 #f7857c; }
	77.4% { transform: translate(5px, -27px); box-shadow: 77px 0 0 0 #f7857c; }
	81.0% { transform: translate(6px, 0px); box-shadow: 76px 0 0 0 #f7857c; }
	83.4% { transform: translate(36px, 0px); box-shadow: 49px 0 0 0 #f7857c; }
	86.1% { transform: translate(42px, 0px); box-shadow: 43px 0 0 0 #f7857c; }
	87.6% { transform: translate(42px, 0px); box-shadow: 43px 0 0 0 #f7857c; }
	89.4% { transform: translate(6px, 2px); box-shadow: 77px 0 0 0 #f7857c; }
	91.2% { transform: translate(6px, 2px); box-shadow: 77px 0 0 0 #f7857c; }
	93.3% { transform: translate(2px, -1px); box-shadow: 79px 0 0 0 #f7857c; }
	93.9% { transform: translate(2px, -1px); box-shadow: 79px 0 0 0 #f7857c; }
	94.8% { transform: translate(-4px, -1px); box-shadow: 66px 0 0 0 #f7857c; }
	96.0% { transform: translate(-3px, 0px); box-shadow: 70px 0 0 0 #f7857c; }
	97.8% { transform: translate(2px, 1px); box-shadow: 80px 0 0 0 #f7857c; }
	100%  { transform: translate(-4px, 0px); }
}
@keyframes alchemistNose {
	0.0%  { transform: translate(-13px, 0px) scaleX(0.8); }
	2.7%  { transform: translate(-17px, 0px) scaleX(0.9); }
	5.7%  { transform: translate(1px, 0px) scaleX(1); }
	7.2%  { transform: translate(2px, 0px) scaleX(1); }
	8.7%  { transform: translate(1px, -7px) scaleX(1); }
	12.3% { transform: translate(0px, -1px) scaleX(1); }
	14.7% { transform: translate(-3px, 1px) scaleX(1); }
	17.7% { transform: translate(-14px, 1px) scaleX(1); }
	19.5% { transform: translate(-15px, 1px) scaleX(0.9); }
	22.2% { transform: translate(1px, 1px) scaleX(1); }
	24.0% { transform: translate(35px, -3px) scaleX(0.7); }
	24.9% { transform: translate(2px, 2px) scaleX(1); }
	25.8% { transform: translate(-35px, 0px) scaleX(0.7); }
	27.9% { transform: translate(1px, 2px) scaleX(1); }
	30.3% { transform: translate(3px, 4px) scaleX(1); }
	31.8% { transform: translate(11px, 0px) scaleX(1); }
	33.6% { transform: translate(-4px, 2px) scaleX(1); }
	36.3% { transform: translate(-2px, 1px) scaleX(1); }
	38.4% { transform: translate(6px, -3px) scaleX(0.9); }
	39.3% { transform: translate(2px, -16px) scaleX(0.9); }
	40.8% { transform: translate(5px, 1px) scaleX(0.9); }
	41.1% { transform: translate(4px, 2px) scaleX(0.9); }
	42.0% { transform: translate(-21px, 2px) scaleX(0.8); }
	43.5% { transform: translate(-21px, 2px) scaleX(0.8); }
	44.4% { transform: translate(-35px, -8px) scaleX(0.6); }
	48.0% { transform: translate(7px, 0px) scaleX(1); }
	49.8% { transform: translate(-2px, -8px) scaleX(1); }
	53.1% { transform: translate(-14px, -4px) scaleX(1); }
	54.0% { transform: translate(-14px, -4px) scaleX(1); }
	56.4% { transform: translate(33px, -4px) scaleX(0.7); }
	57.6% { transform: translate(3px, -2px) scaleX(1); }
	59.7% { transform: translate(-28px, 3px) scaleX(0.8); }
	62.1% { transform: translate(-1px, 3px) scaleX(1); }
	63.9% { transform: translate(35px, -5px) scaleX(0.8); }
	65.4% { transform: translate(35px, -5px) scaleX(0.8); }
	66.6% { transform: translate(2px, 1px) scaleX(1); }
	68.7% { transform: translate(2px, 1px) scaleX(1); }
	70.2% { transform: translate(-1px, 1px) scaleX(1); }
	71.4% { transform: translate(-1px, 1px) scaleX(1); }
	75.9% { transform: translate(4px, 1px) scaleX(1); }
	77.4% { transform: translate(3px, -21px) scaleX(1); }
	81.0% { transform: translate(5px, 1px) scaleX(1); }
	83.4% { transform: translate(32px, 2px) scaleX(0.8); }
	86.1% { transform: translate(38px, 2px) scaleX(0.7); }
	87.6% { transform: translate(38px, 2px) scaleX(0.7); }
	89.4% { transform: translate(7px, 2px) scaleX(0.9); }
	91.2% { transform: translate(6px, 2px) scaleX(1); }
	93.3% { transform: translate(2px, 2px) scaleX(1); }
	93.9% { transform: translate(2px, 2px) scaleX(1); }
	94.8% { transform: translate(-15px, 2px) scaleX(0.8); }
	96.0% { transform: translate(-12px, 2px) scaleX(0.9); }
	97.8% { transform: translate(2px, 3px) scaleX(1); }
	100%  { transform: translate(-13px, 0px) scaleX(0.8); }
}
@keyframes alchemistLeftEye {
	0.0%  { transform: translate(-10px, 0px); }
	2.7%  { transform: translate(-14px, 0px); }
	5.7%  { transform: translate(1px, -1px); }
	7.2%  { transform: translate(0px, 1px); }
	8.7%  { transform: translate(2px, -12px); }
	12.3% { transform: translate(2px, -1px); }
	14.7% { transform: translate(-1px, 0px); }
	17.7% { transform: translate(-13px, 2px); }
	19.5% { transform: translate(-13px, 0px); }
	22.2% { transform: translate(1px, 1px); }
	24.0% { transform: translate(29px, 0px); }
	24.9% { transform: translate(3px, 2px); }
	25.8% { transform: translate(-27px, 0px); }
	27.9% { transform: translate(1px, 1px); }
	30.3% { transform: translate(4px, 2px); }
	31.8% { transform: translate(10px, 0px); }
	33.6% { transform: translate(-3px, 1px); }
	36.3% { transform: translate(-2px, -1px); }
	38.4% { transform: translate(5px, -6px); }
	39.3% { transform: translate(1px, -24px); }
	40.8% { transform: translate(5px, 0px); }
	41.1% { transform: translate(5px, 0px); }
	42.0% { transform: translate(-17px, 1px); }
	43.5% { transform: translate(-17px, 1px); }
	44.4% { transform: translate(-26px, -19px); }
	48.0% { transform: translate(5px, 0px); }
	49.8% { transform: translate(-2px, -10px); }
	53.1% { transform: translate(-13px, -5px); }
	54.0% { transform: translate(-13px, -5px); }
	56.4% { transform: translate(24px, -10px); }
	57.6% { transform: translate(3px, -4px); }
	59.7% { transform: translate(-24px, 0px); }
	62.1% { transform: translate(1px, 0px); }
	63.9% { transform: translate(29px, -3px); }
	65.1% { transform: translate(29px, -3px); }
	65.4% { transform: translate(29px, -1px); }
	66.6% { transform: translate(2px, 1px); }
	67.5% { transform: translate(2px, -1px); }
	68.7% { transform: translate(-13px, -1px); }
	70.2% { transform: translate(-1px, 0px); }
	71.4% { transform: translate(-1px, 0px); }
	75.9% { transform: translate(5px, 0px); }
	77.4% { transform: translate(3px, -28px); }
	81.0% { transform: translate(5px, 0px); }
	83.4% { transform: translate(26px, 1px); }
	86.1% { transform: translate(29px, -4px); }
	87.6% { transform: translate(29px, -4px); }
	89.4% { transform: translate(5px, 2px); }
	91.2% { transform: translate(3px, 3px); }
	93.3% { transform: translate(3px, 0px); }
	93.9% { transform: translate(3px, 0px); }
	94.8% { transform: translate(-12px, 0px); }
	96.0% { transform: translate(-10px, 2px); }
	97.8% { transform: translate(3px, 2px); }
	100%  { transform: translate(-10px, 0px); }
}
@keyframes alchemistLeftBrow {
	0.0%  { transform: rotate(46deg) translate(-6px, -3px); }
	2.7%  { transform: rotate(50deg) translate(-3px, -2px); }
	5.7%  { transform: rotate(45deg) translate(-1px, 0px); }
	7.2%  { transform: rotate(45deg) translate(0px, 0px); }
	8.7%  { transform: rotate(33deg) translate(-4px, -3px); }
	12.3% { transform: rotate(46deg) translate(1px, 0px); }
	19.5% { transform: rotate(51deg) translate(1px, 0px); }
	22.2% { transform: rotate(46deg) translate(1px, -1px); }
	24.0% { transform: rotate(44deg) translate(-3px, 2px); }
	24.9% { transform: rotate(46deg) translate(-2px, -1px); }
	25.8% { transform: rotate(59deg) translate(0px, -2px); }
	27.9% { transform: rotate(46deg) translate(-1px, 0px); }
	31.8% { transform: rotate(46deg) translate(-1px, 0px); }
	33.6% { transform: rotate(50deg) translate(-1px, -2px); }
	36.3% { transform: rotate(50deg) translate(1px, -2px); }
	39.3% { transform: rotate(50deg) translate(1px, -2px); }
	40.8% { transform: rotate(47deg) translate(-1px, -2px); }
	44.4% { transform: rotate(65deg) translate(-1px, -2px); }
	48.0% { transform: rotate(45deg) translate(-1px, 0px); }
	49.8% { transform: rotate(47deg) translate(-1px, -1px); }
	54.0% { transform: rotate(47deg) translate(-1px, -1px); }
	56.4% { transform: rotate(40deg) translate(-2px, 3px); }
	57.6% { transform: rotate(48deg) translate(0px, 0px); }
	59.7% { transform: rotate(58deg) translate(3px, -1px); }
	62.1% { transform: rotate(45deg) translate(0px, -1px); }
	63.9% { transform: rotate(42deg) translate(-2px, 3px); }
	65.4% { transform: rotate(42deg) translate(-2px, 3px); }
	66.6% { transform: rotate(49deg) translate(5px, -4px); }
	67.5% { transform: rotate(49deg) translate(5px, -4px); }
	68.7% { transform: rotate(57deg) translate(8px, -7px); }
	70.2% { transform: rotate(52deg) translate(5px, -6px); }
	71.4% { transform: rotate(45deg) translate(0px, -4px); }
	75.9% { transform: rotate(48deg) translate(-4px, -4px); }
	77.4% { transform: rotate(48deg) translate(-6px, -8px); }
	81.0% { transform: rotate(48deg) translate(1px, -3px); }
	83.4% { transform: rotate(44deg) translate(-1px, 0px); }
	86.1% { transform: rotate(41deg) translate(-3px, 3px); }
	87.6% { transform: rotate(41deg) translate(-3px, 3px); }
	89.4% { transform: rotate(45deg) translate(-1px, 0px); }
	91.2% { transform: rotate(43deg) translate(-1px, 1px); }
	93.3% { transform: rotate(39deg) translate(-1px, 3px); }
	93.9% { transform: rotate(39deg) translate(-1px, 3px); }
	94.8% { transform: rotate(47deg) translate(-1px, -1px); }
	96.0% { transform: rotate(46deg) translate(-3px, -3px); }
	97.8% { transform: rotate(41deg) translate(-3px, -3px); }
	100%  { transform: rotate(46deg) translate(-6px, -3px); }
}
@keyframes alchemistRightEye {
	0.0%  { transform: translate(-9px, 0px); }
	2.7%  { transform: translate(-13px, 1px); }
	5.7%  { transform: translate(1px, 0px); }
	7.2%  { transform: translate(1px, 0px); }
	8.7%  { transform: translate(2px, -14px); }
	12.3% { transform: translate(2px, 1px); }
	14.7% { transform: translate(-1px, 0px); }
	17.7% { transform: translate(-10px, 2px); }
	19.5% { transform: translate(-12px, 1px); }
	22.2% { transform: translate(0px, 1px); }
	24.0% { transform: translate(28px, 0px); }
	24.9% { transform: translate(4px, 3px); }
	25.8% { transform: translate(-26px, 1px); }
	27.9% { transform: translate(1px, 1px); }
	30.3% { transform: translate(4px, 3px); }
	31.8% { transform: translate(10px, 1px); }
	33.6% { transform: translate(-4px, 1px); }
	36.3% { transform: translate(-2px, -1px); }
	38.4% { transform: translate(6px, -8px); }
	39.3% { transform: translate(3px, -23px); }
	40.8% { transform: translate(5px, 1px); }
	41.1% { transform: translate(5px, 1px); }
	42.0% { transform: translate(-15px, 2px); }
	43.5% { transform: translate(-15px, 2px); }
	44.4% { transform: translate(-25px, -16px); }
	48.0% { transform: translate(5px, 0px); }
	49.8% { transform: translate(-2px, -12px); }
	53.1% { transform: translate(-11px, -5px); }
	54.0% { transform: translate(-11px, -5px); }
	56.4% { transform: translate(25px, -11px); }
	57.6% { transform: translate(3px, -2px); }
	59.7% { transform: translate(-21px, 1px); }
	62.1% { transform: translate(0px, 1px); }
	63.9% { transform: translate(28px, -2px); }
	65.4% { transform: translate(28px, -2px); }
	66.6% { transform: translate(3px, 2px); }
	67.5% { transform: translate(3px, 2px); }
	68.7% { transform: translate(-11px, 0px); }
	70.2% { transform: translate(0px, 0px); }
	71.4% { transform: translate(0px, 0px); }
	75.9% { transform: translate(5px, 1px); }
	77.4% { transform: translate(3px, -29px); }
	81.0% { transform: translate(6px, 2px); }
	83.4% { transform: translate(26px, 2px); }
	86.1% { transform: translate(27px, -4px); }
	87.6% { transform: translate(27px, -4px); }
	89.4% { transform: translate(6px, 2px); }
	91.2% { transform: translate(3px, 2px); }
	93.9% { transform: translate(3px, 2px); }
	94.8% { transform: translate(-11px, 1px); }
	96.0% { transform: translate(-9px, 2px); }
	97.8% { transform: translate(3px, 2px); }
	100%  { transform: translate(-9px, 0px); }
}
@keyframes alchemistRightBrow {
	0.0%  { transform: rotate(-37deg) translate(3px, 0px); }
	2.7%  { transform: rotate(-41deg) translate(1px, 2px); }
	5.7%  { transform: rotate(-45deg) translate(0px, 0px); }
	7.2%  { transform: rotate(-48deg) translate(-1px, -1px); }
	8.7%  { transform: rotate(-31deg) translate(4px, 1px); }
	12.3% { transform: rotate(-44deg) translate(2px, 1px); }
	14.7% { transform: rotate(-44deg) translate(1px, 1px); }
	17.7% { transform: rotate(-46deg) translate(1px, -1px); }
	19.5% { transform: rotate(-45deg) translate(1px, 1px); }
	22.2% { transform: rotate(-45deg) translate(1px, 1px); }
	24.0% { transform: rotate(-58deg) translate(3px, 1px); }
	24.9% { transform: rotate(-45deg) translate(-1px, -1px); }
	25.8% { transform: rotate(-42deg) translate(4px, 3px); }
	27.9% { transform: rotate(-46deg) translate(0px, 0px); }
	30.3% { transform: rotate(-46deg) translate(0px, 0px); }
	31.8% { transform: rotate(-49deg) translate(1px, -1px); }
	33.6% { transform: rotate(-47deg) translate(1px, -1px); }
	36.3% { transform: rotate(-52deg) translate(-1px, 0px); }
	38.4% { transform: rotate(-59deg) translate(-1px, -2px); }
	39.3% { transform: rotate(-51deg) translate(-1px, -3px); }
	40.8% { transform: rotate(-45deg) translate(0px, 0px); }
	41.1% { transform: rotate(-45deg) translate(0px, 0px); }
	42.0% { transform: rotate(-44deg) translate(0px, 1px); }
	43.5% { transform: rotate(-44deg) translate(0px, 1px); }
	44.4% { transform: rotate(-42deg) translate(3px, 3px); }
	48.0% { transform: rotate(-47deg) translate(1px, 1px); }
	54.0% { transform: rotate(-47deg) translate(1px, 1px); }
	56.4% { transform: rotate(-58deg) translate(1px, -2px); }
	57.6% { transform: rotate(-44deg) translate(1px, 0px); }
	59.7% { transform: rotate(-45deg) translate(1px, 1px); }
	65.4% { transform: rotate(-57deg) translate(1px, 1px); }
	66.6% { transform: rotate(-49deg) translate(-3px, -2px); }
	70.2% { transform: rotate(-49deg) translate(-3px, -2px); }
	71.4% { transform: rotate(-48deg) translate(0px, -2px); }
	75.9% { transform: rotate(-44deg) translate(4px, -2px); }
	77.4% { transform: rotate(-42deg) translate(3px, 1px); }
	81.0% { transform: rotate(-42deg) translate(0px, 1px); }
	83.4% { transform: rotate(-53deg) translate(4px, 1px); }
	86.1% { transform: rotate(-56deg) translate(3px, -1px); }
	91.2% { transform: rotate(-48deg) translate(3px, -1px); }
	93.3% { transform: rotate(-44deg) translate(8px, -5px); }
	93.9% { transform: rotate(-44deg) translate(8px, -5px); }
	94.8% { transform: rotate(-41deg) translate(7px, -2px); }
	96.0% { transform: rotate(-41deg) translate(3px, 0px); }
}
@keyframes alchemistRightShoulder {
	0.0%  { transform: rotate(48deg) translate(11px, 10px); }
	2.7%  { transform: rotate(47deg) translate(3px, -7px); }
	5.7%  { transform: rotate(42deg) translate(4px, 3px); }
	7.2%  { transform: rotate(42deg) translate(7px, 10px); }
	8.7%  { transform: rotate(46deg) translate(12px, 1px); }
	12.3% { transform: rotate(51deg) translate(18px, -9px); }
	14.7% { transform: rotate(46deg) translate(8px, -1px); }
	17.7% { transform: rotate(47deg) translate(-5px, 7px); }
	19.5% { transform: rotate(45deg) translate(-5px, 5px); }
	21.3% { transform: rotate(46deg) translate(2px, -1px); }
	22.2% { transform: rotate(46deg) translate(0px, -4px); }
	24.0% { transform: rotate(46deg) translate(-3px, -8px); }
	24.9% { transform: rotate(22deg) translate(-2px, -16px); }
	25.8% { transform: rotate(21deg) translate(-2px, -16px); }
	27.9% { transform: rotate(51deg) translate(10px, -6px); }
	30.3% { transform: rotate(48deg) translate(15px, 3px); }
	31.8% { transform: rotate(30deg) translate(0px, 0px); }
	33.3% { transform: rotate(47deg) translate(0px, -2px); }
	36.3% { transform: rotate(40deg) translate(-2px, 5px); }
	38.4% { transform: rotate(40deg) translate(1px, 9px); }
	39.3% { transform: rotate(40deg) translate(1px, 9px); }
	40.8% { transform: rotate(49deg) translate(7px, -4px); }
	41.1% { transform: rotate(51deg) translate(6px, 3px); }
	42.0% { transform: rotate(56deg) translate(18px, 7px); }
	43.5% { transform: rotate(54deg) translate(9px, -1px); }
	44.4% { transform: rotate(52deg) translate(4px, -5px); }
	48.0% { transform: rotate(46deg) translate(4px, -1px); }
	56.4% { transform: rotate(28deg) translate(4px, -1px); }
	57.6% { transform: rotate(45deg) translate(4px, 1px); }
	59.7% { transform: rotate(44deg) translate(1px, 5px); }
	62.1% { transform: rotate(42deg) translate(-4px, -2px); }
	63.9% { transform: rotate(16deg) translate(6px, -13px); }
	65.1% { transform: rotate(12deg) translate(6px, -13px); }
	65.4% { transform: rotate(15deg) translate(6px, 0px); }
	66.6% { transform: rotate(45deg) translate(-4px, -10px); }
	67.5% { transform: rotate(45deg) translate(-4px, -10px); }
	68.7% { transform: rotate(55deg) translate(4px, 0px); }
	70.2% { transform: rotate(52deg) translate(2px, -6px); }
	71.4% { transform: rotate(45deg) translate(3px, 0px); }
	81.0% { transform: rotate(45deg) translate(3px, 0px); }
	83.4% { transform: rotate(40deg) translate(3px, -20px); }
	86.4% { transform: rotate(44deg) translate(-17px, 11px); }
	86.7% { transform: rotate(44deg) translate(-17px, 11px); }
	87.6% { transform: rotate(52deg) translate(-18px, 1px); }
	88.8% { transform: rotate(52deg) translate(-12px, -6px); }
	91.2% { transform: rotate(46deg) translate(-12px, -6px); }
	93.3% { transform: rotate(44deg) translate(1px, -21px); }
	93.9% { transform: rotate(44deg) translate(1px, -21px); }
	94.8% { transform: rotate(46deg) translate(1px, -16px); }
	96.0% { transform: rotate(46deg) translate(7px, -1px); }
	97.8% { transform: rotate(46deg) translate(7px, -1px); }
	100%  { transform: rotate(48deg) translate(11px, 10px); }
}
@keyframes alchemistLeftShoulder {
	0.0%  { transform: rotate(-39deg) translate(-6px, 3px); }
	2.7%  { transform: rotate(-45deg) translate(21px, -7px); }
	5.7%  { transform: rotate(-47deg) translate(-2px, -1px); }
	7.2%  { transform: rotate(-48deg) translate(-12px, 3px); }
	8.7%  { transform: rotate(-46deg) translate(-2px, -2px); }
	12.3% { transform: rotate(-46deg) translate(18px, 5px); }
	14.7% { transform: rotate(-47deg) translate(6px, -1px); }
	17.7% { transform: rotate(-48deg) translate(-1px, -12px); }
	19.5% { transform: rotate(-42deg) translate(-1px, -12px); }
	21.3% { transform: rotate(-51deg) translate(3px, -4px); }
	22.2% { transform: rotate(-51deg) translate(5px, -8px); }
	24.0% { transform: rotate(-51deg) translate(12px, -12px); }
	25.8% { transform: rotate(-41deg) translate(12px, -12px); }
	27.9% { transform: rotate(-31deg) translate(11px, -1px); }
	30.3% { transform: rotate(-51deg) translate(11px, 12px); }
	31.8% { transform: rotate(-27deg) translate(1px, -7px); }
	33.3% { transform: rotate(-44deg) translate(17px, -12px); }
	36.3% { transform: rotate(-51deg) translate(7px, -9px); }
	38.4% { transform: rotate(-51deg) translate(-7px, -9px); }
	39.3% { transform: rotate(-51deg) translate(-7px, -9px); }
	40.8% { transform: rotate(-45deg) translate(13px, -5px); }
	41.1% { transform: rotate(-45deg) translate(13px, -5px); }
	42.0% { transform: rotate(-44deg) translate(1px, 0px); }
	43.5% { transform: rotate(-43deg) translate(3px, -5px); }
	44.4% { transform: rotate(-43deg) translate(10px, -8px); }
	48.0% { transform: rotate(-45deg) translate(4px, -5px); }
	54.0% { transform: rotate(-45deg) translate(4px, -5px); }
	56.4% { transform: rotate(-51deg) translate(-8px, -10px); }
	57.6% { transform: rotate(-46deg) translate(0px, -6px); }
	59.7% { transform: rotate(-41deg) translate(0px, -19px); }
	62.1% { transform: rotate(-46deg) translate(19px, 1px); }
	63.9% { transform: rotate(-50deg) translate(9px, -6px); }
	68.7% { transform: rotate(-50deg) translate(9px, -6px); }
	70.2% { transform: rotate(-47deg) translate(7px, -9px); }
	71.4% { transform: rotate(-48deg) translate(7px, -4px); }
	83.4% { transform: rotate(-48deg) translate(7px, -4px); }
	85.8% { transform: rotate(-47deg) translate(-3px, -12px); }
	86.7% { transform: rotate(-47deg) translate(-3px, -12px); }
	87.6% { transform: rotate(-46deg) translate(4px, -10px); }
	88.8% { transform: rotate(-35deg) translate(4px, -12px); }
	89.7% { transform: rotate(-35deg) translate(4px, -12px); }
	91.2% { transform: rotate(-37deg) translate(6px, -17px); }
	93.3% { transform: rotate(-23deg) translate(12px, -25px); }
	93.9% { transform: rotate(-35deg) translate(12px, -14px); }
	94.8% { transform: rotate(-40deg) translate(12px, -14px); }
	96.0% { transform: rotate(-44deg) translate(12px, -9px); }
	97.8% { transform: rotate(-44deg) translate(12px, -5px); }
	100%  { transform: rotate(-39deg) translate(-6px, 3px); }
}
@keyframes alchemistRightCloak {
	0.0%  { transform: skew(10deg) translate(-12px, 0px); }
	2.7%  { transform: skew(11deg) translate(2px, 0px); }
	5.7%  { transform: skew(11deg) translate(2px, 0px); }
	7.2%  { transform: skew(12deg) translate(0px, 0px); }
	8.7%  { transform: skew(12deg) translate(3px, 0px); }
	12.3% { transform: skew(10deg) translate(2px, 0px); }
	14.7% { transform: skew(10deg) translate(-1px, 0px); }
	17.7% { transform: skew(10deg) translate(-17px, 0px); }
	19.5% { transform: skew(10deg) translate(-12px, 0px); }
	21.3% { transform: skew(10deg) translate(-5px, 0px); }
	22.2% { transform: skew(10deg) translate(-3px, 0px); }
	24.0% { transform: skew(10deg) translate(-1px, 0px); }
	24.9% { transform: skew(10deg) translate(12px, -22px); }
	25.8% { transform: skew(10deg) translate(12px, -22px); }
	27.9% { transform: skew(10deg) translate(-4px, -22px); }
	30.3% { transform: skew(10deg) translate(-4px, -2px); }
	31.8% { transform: skew(10deg) translate(15px, -19px); }
	33.3% { transform: skew(10deg) translate(-6px, -8px); }
	36.3% { transform: skew(10deg) translate(-3px, -8px); }
	38.4% { transform: skew(10deg) translate(-4px, 0px); }
	40.8% { transform: skew(10deg) translate(-4px, 0px); }
	41.1% { transform: skew(10deg) translate(-14px, 0px); }
	42.0% { transform: skew(10deg) translate(-22px, 0px); }
	43.5% { transform: skew(10deg) translate(-14px, 0px); }
	44.4% { transform: skew(10deg) translate(-10px, 0px); }
	48.0% { transform: skew(10deg) translate(-3px, 0px); }
	54.0% { transform: skew(10deg) translate(-3px, 0px); }
	56.4% { transform: skew(10deg) translate(21px, -20px); }
	57.6% { transform: skew(10deg) translate(-3px, 0px); }
	59.7% { transform: skew(10deg) translate(-6px, 0px); }
	62.1% { transform: skew(10deg) translate(-1px, 0px); }
	63.9% { transform: skew(10deg) translate(19px, -20px); }
	65.4% { transform: skew(10deg) translate(19px, -20px); }
	66.6% { transform: skew(10deg) translate(2px, -20px) }
	68.7% { transform: skew(10deg) translate(2px, -20px) }
	70.2% { transform: skew(10deg) translate(-9px, 0px); }
	71.4% { transform: skew(10deg) translate(-3px, 0px); }
	83.4% { transform: skew(10deg) translate(-3px, 0px); }
	86.4% { transform: skew(10deg) translate(-22px, 0px); }
	86.7% { transform: skew(10deg) translate(-22px, 0px); }
	87.6% { transform: skew(10deg) translate(-25px, 0px); }
	88.8% { transform: skew(10deg) translate(-16px, 0px); }
	89.7% { transform: skew(10deg) translate(-16px, 0px); }
	91.2% { transform: skew(10deg) translate(-8px, 0px); }
	93.3% { transform: skew(10deg) translate(16px, 0px); }
	93.9% { transform: skew(10deg) translate(16px, 0px); }
	94.8% { transform: skew(10deg) translate(8px, 0px); }
	96.0% { transform: skew(10deg) translate(0px, 0px); }
	97.8% { transform: skew(10deg) translate(0px, 0px); }
	100%  { transform: skew(10deg) translate(-12px, 0px); }
}
@keyframes alchemistLeftCloak {
	0.0%  { transform: skew(-7deg) translate(-9px, 0px); }
	2.7%  { transform: skew(-7deg) translate(4px, -10px); }
	5.7%  { transform: skew(-7deg) translate(3px, -6px); }
	7.2%  { transform: skew(-7deg) translate(2px, -6px); }
	8.7%  { transform: skew(-7deg) translate(1px, -6px); }
	12.3% { transform: skew(-7deg) translate(16px, -6px); }
	14.7% { transform: skew(-7deg) translate(6px, -6px); }
	17.7% { transform: skew(-5deg) translate(-1px, -6px); }
	19.5% { transform: skew(-5deg) translate(-9px, -6px); }
	21.3% { transform: skew(-5deg) translate(11px, -6px); }
	22.2% { transform: skew(-5deg) translate(10px, -6px); }
	24.0% { transform: skew(-5deg) translate(9px, -6px); }
	24.9% { transform: skew(-5deg) translate(3px, -6px); }
	27.9% { transform: skew(-5deg) translate(3px, -36px); }
	30.3% { transform: skew(-5deg) translate(30px, 0px); }
	31.8% { transform: skew(-5deg) translate(-12px, -39px); }
	33.3% { transform: skew(-5deg) translate(7px, -21px); }
	36.3% { transform: skew(-5deg) translate(11px, -21px); }
	38.4% { transform: skew(-5deg) translate(3px, 0px); }
	39.3% { transform: skew(-5deg) translate(3px, 0px); }
	40.8% { transform: skew(-5deg) translate(5px, 0px); }
	41.1% { transform: skew(-5deg) translate(5px, 0px); }
	42.0% { transform: skew(-5deg) translate(3px, 0px); }
	43.5% { transform: skew(-5deg) translate(2px, -10px); }
	44.4% { transform: skew(-5deg) translate(2px, -10px); }
	48.0% { transform: skew(-5deg) translate(4px, -10px); }
	54.0% { transform: skew(-5deg) translate(4px, -10px); }
	56.4% { transform: skew(-5deg) translate(1px, -10px); }
	57.6% { transform: skew(-5deg) translate(1px, 0px); }
	59.7% { transform: skew(-5deg) translate(-16px, -13px); }
	62.1% { transform: skew(-5deg) translate(16px, -3px); }
	63.9% { transform: skew(-5deg) translate(11px, -3px); }
	68.7% { transform: skew(-5deg) translate(11px, -3px); }
	70.2% { transform: skew(-5deg) translate(3px, -3px); }
	71.4% { transform: skew(-5deg) translate(10px, -3px); }
	83.4% { transform: skew(-5deg) translate(10px, -3px); }
	85.8% { transform: skew(-5deg) translate(-3px, -3px); }
	86.7% { transform: skew(-5deg) translate(-3px, -3px); }
	87.6% { transform: skew(-5deg) translate(0px, 0px); }
	88.8% { transform: skew(-5deg) translate(-8px, -30px); }
	89.7% { transform: skew(-5deg) translate(-8px, -30px); }
	91.2% { transform: skew(-5deg) translate(-8px, -34px); }
	93.3% { transform: skew(-5deg) translate(-13px, -64px); }
	93.9% { transform: skew(-5deg) translate(-13px, -64px); }
	94.8% { transform: skew(-5deg) translate(-6px, -14px); }
	96.0% { transform: skew(-5deg) translate(0px, 0px); }
	97.8% { transform: skew(-5deg) translate(3px, 0px); }
	100%  { transform: skew(-7deg) translate(-9px, 0px); }
}
@keyframes alchemistLeftLeg {
	0.0%  { transform: rotate(18deg) translate(-38px, -3px); }
	0.6%  { transform: rotate(28deg) translate(-37px, 32px); }
	2.4%  { transform: rotate(28deg) translate(-37px, 32px); }
	3.0%  { transform: rotate(21deg) translate(-26px, -12px); }
	3.9%  { transform: rotate(0deg) translate(0px, 0px); }

	41.1% { transform: rotate(0deg) translate(0px, 0px); }
	41.4% { transform: rotate(28deg) translate(-37px, 32px); }
	43.2% { transform: rotate(28deg) translate(-37px, 32px); }
	43.8% { transform: rotate(21deg) translate(-26px, -12px); }
	44.7% { transform: rotate(0deg) translate(0px, 0px); }
	66.9% { transform: rotate(0deg) translate(0px, 0px); }
	67.2% { transform: rotate(21deg) translate(-26px, -12px); }
	68.1% { transform: rotate(0deg) translate(0px, 0px); }
	99.7% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(18deg) translate(-38px, -3px); }
}
@keyframes alchemistPedal {
	0.0%  { transform: rotate(77deg); }
	0.6%  { transform: rotate(87deg); }
	2.4%  { transform: rotate(87deg); }
	3.0%  { transform: rotate(71deg); }
	3.6%  { transform: rotate(80deg); }
	4.2%  { transform: rotate(75deg); }
	5.4%  { transform: rotate(75deg); }
	41.1% { transform: rotate(77deg); }
	41.4% { transform: rotate(87deg); }
	43.2% { transform: rotate(87deg); }
	43.8% { transform: rotate(71deg); }
	44.4% { transform: rotate(80deg); }
	45.0% { transform: rotate(75deg); }
	46.2% { transform: rotate(75deg); }
	67.2% { transform: rotate(71deg); }
	67.8% { transform: rotate(80deg); }
	68.4% { transform: rotate(75deg); }
	69.6% { transform: rotate(75deg); }
	100%  { transform: rotate(77deg); }
}
@keyframes alchemistPedal-1 {
	0.0%  { transform: rotate(31deg); }
	0.6%  { transform: rotate(7deg); }
	2.4%  { transform: rotate(7deg); }
	3.0%  { transform: rotate(50deg); }
	3.6%  { transform: rotate(29deg); }
	4.2%  { transform: rotate(44deg); }
	5.4%  { transform: rotate(31deg); }
	41.1% { transform: rotate(31deg); }
	41.4% { transform: rotate(7deg); }
	43.2% { transform: rotate(7deg); }
	43.8% { transform: rotate(50deg); }
	44.4% { transform: rotate(29deg); }
	45.0% { transform: rotate(44deg); }
	46.2% { transform: rotate(31deg); }
	67.2% { transform: rotate(50deg); }
	67.8% { transform: rotate(29deg); }
	68.4% { transform: rotate(44deg); }
	69.6% { transform: rotate(31deg); }
	100%  { transform: rotate(31deg); }
}
@keyframes alchemistPedal-2 {
	0.0%  { transform: rotate(148deg); }
	0.6%  { transform: rotate(183deg); }
	2.4%  { transform: rotate(183deg); }
	3.0%  { transform: rotate(140deg); }
	3.6%  { transform: rotate(154deg); }
	4.2%  { transform: rotate(144deg); }
	5.4%  { transform: rotate(149deg); }
	41.1% { transform: rotate(148deg); }
	41.4% { transform: rotate(183deg); }
	43.2% { transform: rotate(183deg); }
	43.8% { transform: rotate(140deg); }
	44.4% { transform: rotate(154deg); }
	45.0% { transform: rotate(144deg); }
	46.2% { transform: rotate(149deg); }
	67.2% { transform: rotate(140deg); }
	67.8% { transform: rotate(154deg); }
	68.4% { transform: rotate(144deg); }
	69.6% { transform: rotate(149deg); }
	100%  { transform: rotate(148deg); }
}
@keyframes alchemistPedal-3 {
	0.0%  { transform: rotate(-55deg); }
	0.6%  { transform: rotate(-69deg); }
	2.4%  { transform: rotate(-69deg); }
	3.0%  { transform: rotate(-62deg); }
	3.6%  { transform: rotate(-69deg); }
	4.2%  { transform: rotate(-72deg); }
	5.4%  { transform: rotate(-59deg); }
	41.1% { transform: rotate(-55deg); }
	41.4% { transform: rotate(-69deg); }
	43.2% { transform: rotate(-69deg); }
	43.8% { transform: rotate(-62deg); }
	44.4% { transform: rotate(-69deg); }
	45.0% { transform: rotate(-72deg); }
	46.2% { transform: rotate(-59deg); }
	67.2% { transform: rotate(-62deg); }
	67.8% { transform: rotate(-69deg); }
	68.4% { transform: rotate(-72deg); }
	69.6% { transform: rotate(-59deg); }
	100%  { transform: rotate(-55deg); }
}
@keyframes alchemistRightArm {
	0.0%  { transform: rotate(-38deg) translate(0px, 0px); }
	2.7%  { transform: rotate(-38deg) translate(0px, 0px); }
	5.7%  { transform: rotate(-29deg) translate(0px, 0px); }
	7.2%  { transform: rotate(-29deg) translate(0px, 0px); }
	8.7%  { transform: rotate(-29deg) translate(0px, 0px); }
	12.3% { transform: rotate(-31deg) translate(0px, 0px); }
	14.7% { transform: rotate(-28deg) translate(0px, 0px); }
	17.7% { transform: rotate(-28deg) translate(0px, 0px); }
	19.5% { transform: rotate(-28deg) translate(0px, 0px); }
	21.3% { transform: rotate(-41deg) translate(0px, 0px); }
	22.2% { transform: rotate(-41deg) translate(0px, 0px); }
	24.0% { transform: rotate(-53deg) translate(0px, 0px); }
	24.9% { transform: rotate(-71deg) translate(14px, 20px); }
	25.8% { transform: rotate(-72deg) translate(14px, 20px); }
	27.9% { transform: rotate(-56deg) translate(0px, 0px); }
	30.3% { transform: rotate(-22deg) translate(0px, 0px); }
	31.8% { transform: rotate(-67deg) translate(0px, 0px); }
	33.3% { transform: rotate(-49deg) translate(0px, 0px); }
	36.3% { transform: rotate(-44deg) translate(0px, 0px); }
	39.3% { transform: rotate(-44deg) translate(0px, 0px); }
	40.8% { transform: rotate(-57deg) translate(0px, 0px); }
	41.1% { transform: rotate(-29deg) translate(0px, 0px); }
	54.0% { transform: rotate(-29deg) translate(0px, 0px); }
	56.4% { transform: rotate(-60deg) translate(0px, 0px); }
	57.6% { transform: rotate(-21deg) translate(0px, 0px); }
	59.7% { transform: rotate(-29deg) translate(-14px, 0px); }
	62.1% { transform: rotate(-36deg) translate(0px, 0px); }
	63.9% { transform: rotate(-76deg) translate(16px, 10px); }
	64.5% { transform: rotate(-82deg) translate(16px, 30px); }
	65.1% { transform: rotate(-82deg) translate(16px, 30px); }
	65.4% { transform: rotate(-72deg) translate(0px, 0px); }
	66.6% { transform: rotate(-52deg) translate(0px, 0px); }
	67.5% { transform: rotate(-52deg) translate(0px, 0px); }
	68.7% { transform: rotate(-29deg) translate(0px, 0px); }
	81.0% { transform: rotate(-29deg) translate(0px, 0px); }
	83.4% { transform: rotate(-52deg) translate(7px, 40px); }
	86.4% { transform: rotate(2deg) translate(0px, 0px); }
	89.7% { transform: rotate(2deg) translate(0px, 0px); }
	91.2% { transform: rotate(-48deg) translate(0px, 0px); }
	93.3% { transform: rotate(-15deg) translate(0px, 0px); }
	93.9% { transform: rotate(-15deg) translate(0px, 0px); }
	94.8% { transform: rotate(-49deg) translate(0px, 0px); }
	96.0% { transform: rotate(-28deg) translate(0px, 0px); }
	97.8% { transform: rotate(-28deg) translate(0px, 0px); }
	100%  { transform: rotate(-38deg) translate(0px, 0px); }
}
@keyframes alchemistRightForearm {
	0.0%  { transform: rotate(36deg); }
	2.7%  { transform: rotate(36deg); }
	5.7%  { transform: rotate(18deg); }
	8.7%  { transform: rotate(18deg); }
	12.3% { transform: rotate(24deg); }
	14.7% { transform: rotate(18deg); }
	17.7% { transform: rotate(18deg); }
	19.5% { transform: rotate(8deg); }
	21.3% { transform: rotate(76deg); }
	22.2% { transform: rotate(79deg); }
	24.0% { transform: rotate(100deg); }
	24.9% { transform: rotate(2deg); }
	25.8% { transform: rotate(3deg); }
	27.9% { transform: rotate(113deg); }
	30.3% { transform: rotate(11deg); }
	31.8% { transform: rotate(122deg); }
	33.3% { transform: rotate(67deg); }
	36.3% { transform: rotate(94deg); }
	38.4% { transform: rotate(97deg); }
	39.3% { transform: rotate(81deg); }
	40.8% { transform: rotate(66deg); }
	41.1% { transform: rotate(16deg); }
	54.0% { transform: rotate(16deg); }
	56.4% { transform: rotate(0deg); }
	57.6% { transform: rotate(82deg); }
	59.7% { transform: rotate(0deg); }
	62.1% { transform: rotate(78deg); }
	63.9% { transform: rotate(0deg); }
	65.4% { transform: rotate(0deg); }
	66.6% { transform: rotate(150deg); }
	67.5% { transform: rotate(150deg); }
	68.7% { transform: rotate(25deg); }
	81.0% { transform: rotate(25deg); }
	83.4% { transform: rotate(0deg); }
	86.4% { transform: rotate(50deg); }
	89.7% { transform: rotate(50deg); }
	91.2% { transform: rotate(139deg); }
	93.3% { transform: rotate(150deg); }
	93.9% { transform: rotate(150deg); }
	94.8% { transform: rotate(66deg); }
	96.0% { transform: rotate(18deg); }
	97.8% { transform: rotate(18deg); }
}
@keyframes alchemistLeftArm {
	0.0%  { transform: rotate(45deg) translate(0px, 0px); }
	2.7%  { transform: rotate(40deg) translate(0px, 0px); }
	5.7%  { transform: rotate(40deg) translate(0px, 0px); }
	7.2%  { transform: rotate(38deg) translate(0px, 0px); }
	8.7%  { transform: rotate(41deg) translate(0px, 0px); }
	12.3% { transform: rotate(36deg) translate(0px, 0px); }
	14.7% { transform: rotate(36deg) translate(0px, 0px); }
	17.7% { transform: rotate(70deg) translate(0px, 0px); }
	19.5% { transform: rotate(57deg) translate(2px, 19px); }
	21.3% { transform: rotate(68deg) translate(0px, 0px); }
	22.2% { transform: rotate(61deg) translate(0px, 0px); }
	24.0% { transform: rotate(71deg) translate(0px, 0px); }
	24.9% { transform: rotate(59deg) translate(-3px, 10px); }
	25.8% { transform: rotate(59deg) translate(-3px, 10px); }
	27.9% { transform: rotate(79deg) translate(0px, 0px); }
	30.3% { transform: rotate(29deg) translate(0px, 0px); }
	31.8% { transform: rotate(59deg) translate(0px, 0px); }
	33.3% { transform: rotate(59deg) translate(0px, 0px); }
	36.3% { transform: rotate(51deg) translate(0px, 0px); }
	39.3% { transform: rotate(51deg) translate(0px, 0px); }
	40.8% { transform: rotate(61deg) translate(0px, 0px); }
	41.1% { transform: rotate(39deg) translate(0px, 0px); }
	56.4% { transform: rotate(39deg) translate(0px, 0px); }
	57.6% { transform: rotate(48deg) translate(0px, 0px); }
	59.7% { transform: rotate(53deg) translate(-14px, 13px); }
	62.1% { transform: rotate(55deg) translate(0px, 0px); }
	63.9% { transform: rotate(39deg) translate(0px, 0px); }
	83.4% { transform: rotate(39deg) translate(0px, 0px); }
	85.8% { transform: rotate(46deg) translate(0px, 0px); }
	87.6% { transform: rotate(46deg) translate(0px, 0px); }
	88.8% { transform: rotate(84deg) translate(0px, 0px); }
	91.2% { transform: rotate(84deg) translate(0px, 0px); }
	93.3% { transform: rotate(114deg) translate(0px, 0px); }
	93.9% { transform: rotate(52deg) translate(-22px, 23px); }
	94.8% { transform: rotate(49deg) translate(-18px, 12px); }
	96.0% { transform: rotate(77deg) translate(0px, 0px); }
	97.8% { transform: rotate(38deg) translate(0px, 0px); }
	100%  { transform: rotate(45deg); }
}
@keyframes alchemistLeftForearm {
	0.0%  { transform: rotate(-35deg); }
	2.7%  { transform: rotate(-27deg); }
	5.7%  { transform: rotate(-31deg); }
	7.2%  { transform: rotate(-31deg); }
	8.7%  { transform: rotate(-34deg); }
	12.3% { transform: rotate(-20deg); }
	14.7% { transform: rotate(-20deg); }
	17.7% { transform: rotate(-71deg); }
	19.5% { transform: rotate(-4deg); }
	21.3% { transform: rotate(-99deg); }
	22.2% { transform: rotate(-94deg); }
	24.0% { transform: rotate(-111deg); }
	24.9% { transform: rotate(-11deg); }
	25.8% { transform: rotate(-11deg); }
	27.9% { transform: rotate(-122deg); }
	30.3% { transform: rotate(-1deg); }
	31.8% { transform: rotate(-144deg); }
	33.3% { transform: rotate(-73deg); }
	36.3% { transform: rotate(-93deg); }
	38.4% { transform: rotate(-99deg); }
	39.3% { transform: rotate(-76deg); }
	40.8% { transform: rotate(-56deg); }
	41.1% { transform: rotate(-30deg); }
	56.4% { transform: rotate(-30deg); }
	57.6% { transform: rotate(-42deg); }
	59.7% { transform: rotate(0deg); }
	62.1% { transform: rotate(-116deg); }
	63.9% { transform: rotate(-24deg); }
	87.6% { transform: rotate(-24deg); }
	88.8% { transform: rotate(-120deg); }
	89.7% { transform: rotate(-120deg); }
	91.2% { transform: rotate(-145deg); }
	93.3% { transform: rotate(-155deg); }
	93.9% { transform: rotate(0deg); }
	94.8% { transform: rotate(0deg); }
	96.0% { transform: rotate(-128deg); }
	97.8% { transform: rotate(-23deg); }
	100%  { transform: rotate(-35deg); }
}

@keyframes catEyes {
	6.6% { transform: scaleY(1); }
	7.5% { transform: scaleY(0); }
	8.4% { transform: scaleY(1); }

	12.3% { transform: scaleY(1); }
	13.2% { transform: scaleY(0); }
	14.1% { transform: scaleY(1); }

	28.5% { transform: scaleY(1); }
	29.4% { transform: scaleY(0); }
	30.3% { transform: scaleY(1); }

	42.3% { transform: scaleY(1); }
	43.2% { transform: scaleY(0); }
	44.1% { transform: scaleY(1); }

	56.7% { transform: scaleY(1); }
	57.9% { transform: scaleY(0); }
	59.1% { transform: scaleY(1); }

	61.8% { transform: scaleY(1); }
	62.7% { transform: scaleY(0); }
	63.6% { transform: scaleY(1); }

	73.2% { transform: scaleY(1); }
	74.4% { transform: scaleY(0); }
	75.6% { transform: scaleY(1); }

	81.3% { transform: scaleY(1); }
	82.2% { transform: scaleY(0); }
	83.1% { transform: scaleY(1); }

	96.0% { transform: scaleY(1); }
	96.9% { transform: scaleY(0); }
	97.8% { transform: scaleY(1); }
}
@keyframes cat {
	8.1% { transform: translateY(0px); }
	8.7% { transform: translateY(10px); }
	9.3% { transform: translateY(10px); }
	12.3% { transform: translateY(0px); }

	19.2% { transform: translateY(0px); }
	20.7% { transform: translateY(10px); }
	21.3% { transform: translateY(10px); }
	21.9% { transform: translateY(0px); }

	36.0% { transform: translateY(0px); }
	37.2% { transform: translateY(10px); }
	38.4% { transform: translateY(10px); }
	39.3% { transform: translateY(22px); }
	41.1% { transform: translateY(0px); }

	43.5% { transform: translateY(0px); }
	44.4% { transform: translateY(10px); }
	45.3% { transform: translateY(10px); }
	46.8% { transform: translateY(0px); }

	48.6% { transform: translateY(0px); }
	49.5% { transform: translateY(10px); }
	56.7% { transform: translateY(10px); }
	58.5% { transform: translateY(0px); }

	75.9% { transform: translateY(0px); }
	76.5% { transform: translateY(10px); }
	78.3% { transform: translateY(10px); }
	81.0% { transform: translateY(0px); }
}
@keyframes catHand {
	8.1% { transform: translateY(0px); }
	8.7% { transform: translateY(-10px); }
	9.3% { transform: translateY(-10px); }
	12.3% { transform: translateY(0px); }

	19.2% { transform: translateY(0px); }
	20.7% { transform: translateY(-10px); }
	21.3% { transform: translateY(-10px); }
	21.9% { transform: translateY(0px); }

	36.0% { transform: translateY(0px); }
	37.2% { transform: translateY(-10px); }
	38.4% { transform: translateY(-10px); }
	39.3% { transform: translateY(-22px); }
	41.1% { transform: translateY(0px); }

	43.5% { transform: translateY(0px); }
	44.4% { transform: translateY(-10px); }
	45.3% { transform: translateY(-10px); }
	46.8% { transform: translateY(0px); }

	48.6% { transform: translateY(0px); }
	49.5% { transform: translateY(-10px); }
	56.7% { transform: translateY(-10px); }
	58.5% { transform: translateY(0px); }

	75.9% { transform: translateY(0px); }
	76.5% { transform: translateY(-10px); }
	78.3% { transform: translateY(-10px); }
	81.0% { transform: translateY(0px); }
}

@keyframes forestGhost {
	0.0%  { transform: translate(-4px, -7px); }
	1.5%  { transform: translate(-1px, -15px); }
	3.0%  { transform: translate(1px, -20px); }
	4.5%  { transform: translate(-3px, -18px); }
	6.0%  { transform: translate(-7px, -11px); }
	7.5%  { transform: translate(-2px, -8px); }
	9.0%  { transform: translate(38px, 34px); }
	10.5% { transform: translate(40px, 34px); }
	12.0% { transform: translate(32px, 29px); }
	13.5% { transform: translate(26px, 20px); }
	15.0% { transform: translate(20px, 8px); }
	16.5% { transform: translate(6px, -5px); }
	18.0% { transform: translate(0px, -14px); }
	19.5% { transform: translate(-1px, -19px); }
	21.0% { transform: translate(-4px, -20px); }
	22.6% { transform: translate(-6px, -19px); }
	24.0% { transform: translate(-2px, -15px); }
	25.5% { transform: translate(1px, -9px); }
	27.0% { transform: translate(-1px, -5px); }
	28.5% { transform: translate(-4px, -3px); }
	30.0% { transform: translate(-1px, -3px); }
	31.5% { transform: translate(1px, -8px); }
	33.0% { transform: translate(-6px, -14px); }
	34.5% { transform: translate(-5px, -18px); }
	36.0% { transform: translate(-1px, -18px); }
	37.5% { transform: translate(-2px, -13px); }
	39.0% { transform: translate(-5px, -5px); }
	40.5% { transform: translate(-4px, 2px); }
	42.0% { transform: translate(0px, 5px); }
	43.5% { transform: translate(0px, 3px); }
	45.0% { transform: translate(-4px, -1px); }
	46.5% { transform: translate(-2px, -5px); }
	48.0% { transform: translate(15px, -3px); }
	49.5% { transform: translate(56px, -1px); }
	51.0% { transform: translate(50px, 0px); }
	52.5% { transform: translate(41px, -2px); }
	54.0% { transform: translate(34px, -3px); }
	55.5% { transform: translate(32px, -3px); }
	57.0% { transform: translate(27px, -4px); }
	58.5% { transform: translate(12px, -6px); }
	60.0% { transform: translate(1px, -7px); }
	61.5% { transform: translate(3px, -7px); }
	63.0% { transform: translate(5px, -8px); }
	64.5% { transform: translate(0px, -9px); }
	66.0% { transform: translate(-1px, -10px); }
	67.5% { transform: translate(2px, -10px); }
	69.0% { transform: translate(3px, -9px); }
	70.5% { transform: translate(-1px, -3px); }
	72.0% { transform: translate(-1px, 2px); }
	73.5% { transform: translate(3px, 3px); }
	75.0% { transform: translate(2px, 0px); }
	76.5% { transform: translate(-2px, -3px); }
	78.0% { transform: translate(31px, 13px); }
	79.5% { transform: translate(52px, 27px); }
	81.0% { transform: translate(54px, 22px); }
	82.5% { transform: translate(42px, 17px); }
	84.0% { transform: translate(33px, 9px); }
	85.5% { transform: translate(25px, 2px); }
	87.0% { transform: translate(9px, -6px); }
	88.5% { transform: translate(0px, -10px); }
	90.0% { transform: translate(1px, -15px); }
	91.5% { transform: translate(-2px, -15px); }
	93.0% { transform: translate(-5px, -11px); }
	94.5% { transform: translate(-3px, -5px); }
	96.0% { transform: translate(0px, -1px); }
	97.5% { transform: translate(0px, 0px); }
	100%  { transform: translate(0px, 0px); }
}
@keyframes forestGhostLeg {
	0.0%  { transform: rotate(-5deg); }
	1.5%  { transform: rotate(7deg); }
	3.0%  { transform: rotate(1deg); }
	4.5%  { transform: rotate(-6deg); }
	6.0%  { transform: rotate(-6deg); }
	7.5%  { transform: rotate(7deg); }
	9.0%  { transform: rotate(15deg); }
	10.5% { transform: rotate(-3deg); }
	12.0% { transform: rotate(-13deg); }
	13.5% { transform: rotate(2deg); }
	15.0% { transform: rotate(6deg); }
	16.5% { transform: rotate(-9deg); }
	18.0% { transform: rotate(1deg); }
	19.5% { transform: rotate(5deg); }
	21.0% { transform: rotate(-7deg); }
	22.6% { transform: rotate(-3deg); }
	24.0% { transform: rotate(8deg); }
	25.5% { transform: rotate(5deg); }
	27.0% { transform: rotate(-3deg); }
	28.5% { transform: rotate(-8deg); }
	30.0% { transform: rotate(7deg); }
	31.5% { transform: rotate(3deg); }
	33.0% { transform: rotate(-8deg); }
	34.5% { transform: rotate(3deg); }
	36.0% { transform: rotate(9deg); }
	37.5% { transform: rotate(-2deg); }
	39.0% { transform: rotate(-11deg); }
	40.5% { transform: rotate(0deg); }
	42.0% { transform: rotate(9deg); }
	43.5% { transform: rotate(0deg); }
	45.0% { transform: rotate(-10deg); }
	46.5% { transform: rotate(4deg); }
	48.0% { transform: rotate(10deg); }
	49.5% { transform: rotate(-5deg); }
	51.0% { transform: rotate(-8deg); }
	52.5% { transform: rotate(7deg); }
	54.0% { transform: rotate(-10deg); }
	55.5% { transform: rotate(3deg); }
	57.0% { transform: rotate(8deg); }
	58.5% { transform: rotate(-6deg); }
	60.0% { transform: rotate(-7deg); }
	61.5% { transform: rotate(8deg); }
	63.0% { transform: rotate(4deg); }
	64.5% { transform: rotate(-7deg); }
	66.0% { transform: rotate(2deg); }
	67.5% { transform: rotate(9deg); }
	69.0% { transform: rotate(0deg); }
	70.5% { transform: rotate(-9deg); }
	72.0% { transform: rotate(1deg); }
	73.5% { transform: rotate(9deg); }
	75.0% { transform: rotate(-3deg); }
	76.5% { transform: rotate(-8deg); }
	78.0% { transform: rotate(-2deg); }
	79.5% { transform: rotate(2deg); }
	81.0% { transform: rotate(5deg); }
	82.5% { transform: rotate(-12deg); }
	84.0% { transform: rotate(4deg); }
	85.5% { transform: rotate(9deg); }
	87.0% { transform: rotate(-7deg); }
	88.5% { transform: rotate(0deg); }
	90.0% { transform: rotate(11deg); }
	91.5% { transform: rotate(-2deg); }
	93.0% { transform: rotate(-10deg); }
	94.5% { transform: rotate(4deg); }
	96.0% { transform: rotate(9deg); }
	97.5% { transform: rotate(-3deg); }
	100%  { transform: rotate(0deg); }
}

@keyframes potBubble1 {
	0.0%  { transform: scale(0.7); }
	8.7%  { transform: scale(1.5); }
	90.0% { transform: scale(0.0); }
	11.7% { transform: scale(0.0); }
	23.4% { transform: scale(1.5); }
	23.7% { transform: scale(0.0); }
	27.0% { transform: scale(0.0); }
	38.1% { transform: scale(1.5); }
	38.4% { transform: scale(0.0); }
	42.0% { transform: scale(0.0); }
	52.8% { transform: scale(1.5); }
	53.1% { transform: scale(0.0); }
	63.9% { transform: scale(1.5); }
	64.2% { transform: scale(0.0); }
	67.5% { transform: scale(0.0); }
	78.3% { transform: scale(1.5); }
	78.6% { transform: scale(0.0); }
	81.6% { transform: scale(0.0); }
	93.3% { transform: scale(1.5); }
	93.6% { transform: scale(0.0); }
	96.6% { transform: scale(0.0); }
	100%  { transform: scale(0.7); }
}
@keyframes potBubble2 {
	0.0%  { transform: scale(0.8); }
	3.6%  { transform: scale(1); }
	4.2%  { transform: scale(0); }
	8.4%  { transform: scale(0); }
	15.6% { transform: scale(1); }
	15.9% { transform: scale(0); }
	18.9% { transform: scale(0); }
	27.6% { transform: scale(1); }
	27.9% { transform: scale(0); }
	31.2% { transform: scale(0); }
	39.0% { transform: scale(1); }
	39.3% { transform: scale(0); }
	50.7% { transform: scale(1); }
	51.0% { transform: scale(0); }
	56.4% { transform: scale(1); }
	56.7% { transform: scale(0); }
	60.3% { transform: scale(0); }
	67.5% { transform: scale(1); }
	67.8% { transform: scale(0); }
	72.0% { transform: scale(0); }
	79.5% { transform: scale(1); }
	79.8% { transform: scale(0); }
	83.7% { transform: scale(0); }
	90.9% { transform: scale(1); }
	91.2% { transform: scale(0); }
	95.4% { transform: scale(0); }
	100%  { transform: scale(0.8); }
}
@keyframes potBubble3 {
	0.0%  { transform: scale(0.6); }
	7.2%  { transform: scale(1.6); }
	7.5%  { transform: scale(0.0); }
	8.7%  { transform: scale(0.0); }
	18.9% { transform: scale(1.6); }
	19.2% { transform: scale(0.0); }
	23.1% { transform: scale(0.0); }
	30.9% { transform: scale(1.6); }
	31.2% { transform: scale(0.0); }
	34.8% { transform: scale(0.0); }
	42.6% { transform: scale(1.6); }
	42.9% { transform: scale(0.0); }
	46.2% { transform: scale(0.0); }
	54.0% { transform: scale(1.6); }
	54.3% { transform: scale(0.0); }
	59.7% { transform: scale(1.6); }
	60.0% { transform: scale(0.0); }
	63.6% { transform: scale(0.0); }
	71.1% { transform: scale(1.6); }
	71.4% { transform: scale(0.0); }
	75.0% { transform: scale(0.0); }
	82.8% { transform: scale(1.6); }
	83.1% { transform: scale(0.0); }
	86.7% { transform: scale(0.0); }
	94.5% { transform: scale(1.6); }
	94.8% { transform: scale(0.0); }
	100%  { transform: scale(0.6); }
}
@keyframes potLiquid2 {
	0.0%  { transform: scaleY(1); }
	2.7%  { transform: scaleY(1.1); }
	3.0%  { transform: scaleY(0.8); }

	6.3% { transform: scaleY(0.5); }
	15.3% { transform: scaleY(1.1); }
	15.6% { transform: scaleY(0.8); }

	18.9% { transform: scaleY(0.5); }
	27.9% { transform: scaleY(1.1); }
	28.2% { transform: scaleY(0.8); }

	31.5% { transform: scaleY(0.5); }
	40.5% { transform: scaleY(1.1); }
	40.8% { transform: scaleY(0.8); }

	44.1% { transform: scaleY(0.5); }
	53.1% { transform: scaleY(1.1); }
	53.4% { transform: scaleY(0.8); }

	54.9% { transform: scaleY(0.5); }
	63.9% { transform: scaleY(1.1); }
	64.2% { transform: scaleY(0.8); }

	67.5% { transform: scaleY(0.5); }
	76.5% { transform: scaleY(1.1); }
	76.8% { transform: scaleY(0.8); }
}
@keyframes potDrop {
	0.0%  { transform: translateY(107px); }

	15.2% { transform: translateY(107px); }
	15.3% { transform: translateY(10px); }
	16.2% { transform: translateY(107px); }

	27.8% { transform: translateY(107px); }
	27.9% { transform: translateY(10px); }
	28.8% { transform: translateY(107px); }

	40.4% { transform: translateY(107px); }
	40.5% { transform: translateY(10px); }
	41.4% { transform: translateY(107px); }

	53.0% { transform: translateY(107px); }
	53.1% { transform: translateY(10px); }
	54.0% { transform: translateY(107px); }

	63.8% { transform: translateY(107px); }
	63.9% { transform: translateY(10px); }
	64.8% { transform: translateY(107px); }

	76.4% { transform: translateY(107px); }
	76.5% { transform: translateY(10px); }
	77.4% { transform: translateY(107px); }
	100%  { transform: translateY(107px); }
}

@keyframes potPotion1 {
	0%  { transform: scaleY(0.7); }
	12% { transform: scaleY(1.1); }
	21% { transform: scaleY(0.7); }
	33% { transform: scaleY(1.1); }
	42% { transform: scaleY(0.7); }
	51% { transform: scaleY(1.1); }
	63% { transform: scaleY(0.7); }
	72% { transform: scaleY(1.1); }
	81% { transform: scaleY(0.7); }
	90% { transform: scaleY(1.1); }
}
@keyframes potPotion2 {
	0%  { transform: scaleY(2.6); }
	9%  { transform: scaleY(1); }
	21% { transform: scaleY(2.6); }
	30% { transform: scaleY(1); }
	39% { transform: scaleY(2.6); }
	51% { transform: scaleY(1); }
	60% { transform: scaleY(2.6); }
	69% { transform: scaleY(1); }
	81% { transform: scaleY(2.6); }
	90% { transform: scaleY(1); }
}
@keyframes potPotion3 {
	0%  { transform: scaleY(1); }
	18% { transform: scaleY(0.5); }
	30% { transform: scaleY(1); }
	45% { transform: scaleY(0.5); }
	66% { transform: scaleY(1); }
	81% { transform: scaleY(0.5); }
}

@keyframes snail {
	13.5% { transform: translate(0px, 0px); }
	14.4% { transform: translate(-24px, 0px); }
	15.6% { transform: translate(-19px, 0px); }
	16.5% { transform: translate(-42px, 0px); }
	17.7% { transform: translate(-39px, 0px); }
	18.6% { transform: translate(-63px, 0px); }
	19.8% { transform: translate(-59px, 0px); }
	20.1% { transform: translate(-61px, 0px); }
	20.4% { transform: translate(-61px, 0px); }
	20.7% { transform: translate(-68px, 0px); }
	21.0% { transform: translate(-74px, 0px); }
	21.3% { transform: translate(-79px, 0px); }
	21.6% { transform: translate(-82px, 0px); }
	21.9% { transform: translate(-84px, 0px); }
	24.3% { transform: translate(-84px, 0px); }
	24.6% { transform: translate(-84px, 15px); }
	24.9% { transform: translate(-84px, 46px); }
	25.2% { transform: translate(-84px, 61px); }
	25.5% { transform: translate(-84px, 86px); }
	25.8% { transform: translate(-84px, 116px); }
	26.1% { transform: translate(-84px, 196px); }
	26.4% { transform: translate(-84px, 286px); opacity: 1; }
	26.5% { opacity: 0; }

	84.5% { opacity: 0; }
	84.6% { transform: rotate(-40deg) translate(199px, 135px); opacity: 1; }
	85.8% { transform: rotate(-5deg) translate(30px, 1px); }
	86.4% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes snailBody {
	7.5%  { transform: rotate(0deg) scaleY(1); }
	7.8%  { transform: rotate(8deg) scaleY(1.15); }
	9.0%  { transform: rotate(-3deg) scaleY(1); }
	9.6%  { transform: rotate(-2deg) scaleY(1.02); }
	10.5% { transform: rotate(2deg) scaleY(1); }
	11.4% { transform: rotate(2deg) scaleY(1); }
	12.6% { transform: rotate(0deg) scaleY(1); }
	13.5% { transform: rotate(0deg) scaleY(1.03) scaleX(0.95); }
	14.4% { transform: rotate(0deg) scaleY(1.03) scaleX(0.95); }
	15.6% { transform: rotate(0deg) scaleY(1.04) scaleX(0.95); }
	16.5% { transform: rotate(0deg) scaleY(0.97) scaleX(1); }
	17.7% { transform: rotate(0deg) scaleY(1.03) scaleX(0.96); }
	18.6% { transform: rotate(0deg) scaleY(0.98) scaleX(1.04); }
	19.8% { transform: rotate(0deg) scaleY(1.03) scaleX(0.96); }
	20.1% { transform: rotate(0deg) scaleY(1) scaleX(0.96); }
	20.4% { transform: rotate(0deg) scaleY(1) scaleX(0.96); }
	20.7% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 11px); }
	21.0% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 19px); }
	21.3% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 26px); }
	21.6% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 30px); }
	21.9% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 33px); }
	26.4% { transform: rotate(0deg) scaleY(1) scaleX(1) translate(0px, 33px); }

	84.6% { transform: rotate(-90deg) translate(29px, 29px); }
	87.6% { transform: rotate(-90deg) translate(29px, 29px); }
	88.8% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes snailEye {
	7.2%  { transform: translate(0px, 0px); background: #012135; }
	7.5%  { transform: translate(0px, 0px); background: #29a58c; }
	7.8%  { transform: translate(0px, 0px); background: #29a58c; }
	9.0%  { transform: translate(-2px, 3px) scaleY(1); background: #29a58c; }
	9.6%  { transform: translate(-2px, 3px) scaleY(0); background: #29a58c; }
	10.2% { transform: translate(-2px, 3px) scaleY(0); background: #29a58c; }
	10.5% { transform: translate(-2px, 3px) scaleY(1); background: #29a58c; }
	11.4% { transform: translate(0px, 0px) scaleY(1); background: #29a58c; }
	11.7% { transform: translate(0px, 0px) scaleY(1); background: #29a58c; }
	12.0% { transform: translate(0px, 0px) scaleY(0); background: #29a58c; }
	12.3% { transform: translate(0px, 0px) scaleY(0); background: #29a58c; }
	12.6% { transform: translate(0px, 0px) scaleY(1); background: #29a58c; }
	15.9% { transform: translate(0px, 0px) scaleY(1); background: #012135; }
	16.2% { transform: translate(0px, 0px) scaleY(0); background: #012135; }
	16.5% { transform: translate(0px, 0px) scaleY(0); background: #012135; }
	16.8% { transform: translate(0px, 0px) scaleY(1); background: #012135; }
	20.4% { transform: translate(0px, 0px) scaleY(1); background: #012135; }
	20.7% { transform: translate(0px, 2px) scaleY(1); background: #012135; }
	21.3% { transform: translate(0px, 2px) scaleY(1); background: #012135; }
	21.6% { transform: translate(0px, 4px) scaleY(1); background: #012135; }
	21.9% { transform: translate(0px, 7px) scaleY(1); background: #012135; }
	22.2% { transform: translate(0px, 20px) scaleY(1); background: #012135; }
	22.5% { transform: translate(0px, 34px) scaleY(1); background: #012135; }
	22.8% { transform: translate(0px, 52px) scaleY(0); background: #012135; }
	23.1% { transform: translate(0px, 71px) scaleY(0); background: #012135; }
	23.4% { transform: translate(-6px, 76px) scaleY(1); background: #012135; }
	23.7% { transform: translate(-6px, 90px) scaleY(1); background: #012135; }
	24.0% { transform: translate(-6px, 104px) scaleY(1); background: #012135; }
	24.3% { transform: translate(-6px, 117px) scaleY(1); background: #012135; }
	26.4% { transform: translate(-6px, 117px) scaleY(1); background: #012135; opacity: 1; }
	26.5% { opacity: 0; }

	94.4% { transform: translate(-162px, 40px); opacity: 0; }
	94.5% { transform: translate(-162px, 40px); opacity: 1; }
	95.1% { transform: translate(-87px, 38px); opacity: 1; }
	95.7% { transform: translate(0px, 0px); opacity: 1; }
}
@keyframes snailRightEye {
	7.5%  { transform: rotate(36deg) translate(0px, 0px); }
	7.8%  { transform: rotate(22deg) translate(-8px, -1px); }
	9.0%  { transform: rotate(36deg) translate(1px, 2px); }
	9.6%  { transform: rotate(41deg) translate(2px, 2px); }
	10.5% { transform: rotate(36deg) translate(-1px, -2px); }
	11.4% { transform: rotate(34deg) translate(-5px, -2px); }
	12.6% { transform: rotate(45deg) translate(1px, -2px); }
	13.5% { transform: rotate(45deg) translate(1px, -2px); }
	14.4% { transform: rotate(36deg) translate(1px, -3px); }
	20.4% { transform: rotate(36deg) translate(1px, -3px); }
	20.7% { transform: rotate(36deg) translate(2px, 0px); }
	21.0% { transform: rotate(41deg) translate(1px, 0px); }
	21.3% { transform: rotate(41deg) translate(1px, 0px); }
	21.6% { transform: rotate(41deg) translate(3px, 1px); }
	21.9% { transform: rotate(41deg) translate(5px, 4px); }
	22.2% { transform: rotate(41deg) translate(12px, 15px); }
	22.5% { transform: rotate(41deg) translate(20px, 28px); }
	22.8% { transform: rotate(41deg) translate(27px, 40px); }
	23.1% { transform: rotate(41deg) translate(36px, 52px); }
	23.4% { transform: rotate(41deg) translate(44px, 62px); }
	23.7% { transform: rotate(41deg) translate(52px, 73px); }
	24.0% { transform: rotate(41deg) translate(61px, 85px); }
	24.3% { transform: rotate(41deg) translate(69px, 96px); }
	24.6% { transform: rotate(41deg) translate(67px, 95px); }
	26.4% { transform: rotate(41deg) translate(67px, 95px); opacity: 1; }
	26.5% { opacity: 0; }

	91.8% { transform: rotate(36deg) translate(0px, 27px); opacity: 0; }
	93.0% { transform: rotate(36deg) translate(0px, 0px); opacity: 1; }
}
@keyframes snailLeftEye {
	7.5%  { transform: rotate(-36deg) translate(0px, 0px); }
	7.8%  { transform: rotate(-60deg) translate(-8px, 1px); }
	9.0%  { transform: rotate(-40deg) translate(-4px, 2px); }
	9.6%  { transform: rotate(-34deg) translate(0px, 1px); }
	10.5% { transform: rotate(-48deg) translate(-1px, 1px); }
	11.4% { transform: rotate(-50deg) translate(-3px, 0px); }
	12.6% { transform: rotate(-36deg) translate(2px, 0px); }
	13.5% { transform: rotate(-36deg) translate(2px, 0px); }
	14.4% { transform: rotate(-40deg) translate(1px, 0px); }
	15.6% { transform: rotate(-40deg) translate(0px, 0px); }
	20.4% { transform: rotate(-40deg) translate(0px, 0px); }
	20.7% { transform: rotate(-40deg) translate(-1px, 3px); }
	21.0% { transform: rotate(-38deg) translate(0px, 3px); }
	21.3% { transform: rotate(-38deg) translate(0px, 3px); }
	21.6% { transform: rotate(-38deg) translate(-2px, 3px); }
	21.9% { transform: rotate(-38deg) translate(-4px, 6px); }
	22.2% { transform: rotate(-38deg) translate(-13px, 17px); }
	22.5% { transform: rotate(-38deg) translate(-22px, 28px); }
	22.8% { transform: rotate(-38deg) translate(-32px, 38px); }
	23.1% { transform: rotate(-38deg) translate(-42px, 48px); }
	23.4% { transform: rotate(-38deg) translate(-50px, 59px); }
	23.7% { transform: rotate(-38deg) translate(-59px, 69px); }
	24.0% { transform: rotate(-38deg) translate(-68px, 79px); }
	24.3% { transform: rotate(-38deg) translate(-78px, 90px); }
	24.6% { transform: rotate(-38deg) translate(-78px, 89px); }
	26.4% { transform: rotate(-38deg) translate(-78px, 89px); opacity: 1; }
	26.5% { opacity: 0; }

	91.8% { transform: rotate(-36deg) translate(0px, 24px); opacity: 0; }
	93.0% { transform: rotate(-36deg) translate(0px, 0px); opacity: 1; }
}
@keyframes snailTail {
	12.6% { transform: scaleX(1); }
	13.5% { transform: scaleX(0.77) scaleY(1.2); }
	14.4% { transform: scaleX(1.05) scaleY(1); }
	15.6% { transform: scaleX(0.75) scaleY(1.2); }
	16.5% { transform: scaleX(1.03) scaleY(1); }
	17.7% { transform: scaleX(0.76) scaleY(1.15); }
	18.6% { transform: scaleX(1.05) scaleY(1); }
	19.8% { transform: scaleX(0.75) scaleY(1.15); }
	20.1% { transform: scaleX(0.78) scaleY(1.15); }
	20.4% { transform: scaleX(0.78) scaleY(1.15); }
	20.7% { transform: scaleX(0.86) scaleY(1.1); }
	21.0% { transform: scaleX(0.93) scaleY(1.1); }
	21.3% { transform: scaleX(0.99) scaleY(1); }
	21.6% { transform: scaleX(1.03) scaleY(1); }
	21.9% { transform: scaleX(1.05) scaleY(1); }
	22.2% { transform: scaleX(0.98) scaleY(1); }
	22.5% { transform: scaleX(0.85) scaleY(1); }
	22.8% { transform: scaleX(0.73) scaleY(1.3); }
	23.1% { transform: scaleX(0.60) scaleY(1.3); }
	23.4% { transform: scaleX(0.53) scaleY(1.3); }
	23.7% { transform: scaleX(0.48) scaleY(1.3); }
	24.0% { transform: scaleX(0.4) scaleY(1); }
	24.3% { transform: scaleX(0.4) scaleY(1); opacity: 1; }
	24.6% { transform: scaleX(0.4) scaleY(1); opacity: 0; }

	84.5% { opacity: 0; }
	84.6% { transform: scaleX(1) scaleY(1); opacity: 1; }
}
@keyframes snailSpots {
	20.4% { transform: translate(0px, 0px); }
	20.7% { transform: translate(0px, -6px); }
	21.0% { transform: translate(0px, -12px); }
	21.3% { transform: translate(0px, -17px); }
	21.6% { transform: translate(0px, -21px); }
	21.9% { transform: translate(0px, -23px); }
	22.2% { transform: translate(0px, -15px); }
	22.5% { transform: translate(0px, -1px); }
	22.8% { transform: translate(0px, 15px); }
	23.1% { transform: translate(0px, 29px); }
	23.4% { transform: translate(0px, 35px); }
	23.7% { transform: translate(0px, 35px); }
	24.0% { transform: translate(0px, 37px); }
	24.3% { transform: translate(0px, 52px); }
	24.6% { transform: translate(0px, 32px); }
	84.6% { transform: translate(0px, 0px); }
}
@keyframes snailTummyTop {
	20.4% { transform: translate(0px, 0px); }
	20.7% { transform: translate(0px, -10px); }
	21.9% { transform: translate(0px, -10px); }
	22.2% { transform: translate(0px, -5px); }
	22.5% { transform: translate(0px, 0px); }
	22.8% { transform: translate(0px, 12px) scaleY(1); }
	23.1% { transform: translate(0px, 16px) scaleY(1.8); }
	23.4% { transform: translate(0px, 20px) scaleY(1.9); }
	24.0% { transform: translate(0px, 20px) scaleY(1.9); }
	24.3% { transform: translate(0px, 7px) scaleY(1.5); }
	24.6% { transform: translate(0px, 7px) scaleY(1.5); }
	24.9% { transform: translate(0px, 7px) scaleY(2.5); }
	25.2% { transform: translate(0px, 7px) scaleY(2.8); }
	25.5% { transform: translate(0px, 7px) scaleY(3); }
	25.8% { transform: translate(0px, 7px) scaleY(3.7); }
	26.1% { transform: translate(0px, 7px) scaleY(5); }
	26.4% { transform: translate(0px, 7px) scaleY(5); }
	84.6% { transform: translate(0px, 0px); }
}
@keyframes snailTummyBottom {
	20.4% { transform: translate(0px, 0px); }
	20.7% { transform: translate(0px, -6px); }
	21.0% { transform: translate(0px, -12px); }
	21.3% { transform: translate(0px, -17px); }
	21.6% { transform: translate(0px, -21px); }
	21.9% { transform: translate(0px, -23px); }
	22.2% { transform: translate(0px, -15px); }
	22.5% { transform: translate(0px, -1px); }
	22.8% { transform: translate(0px, 15px); }
	23.1% { transform: translate(0px, 29px); }
	23.4% { transform: translate(0px, 35px) scaleY(1); }
	23.7% { transform: translate(0px, 35px) scaleY(1.45); }
	24.0% { transform: translate(0px, 37px) scaleY(1.8); }
	24.3% { transform: translate(0px, 52px) scaleY(2); }
	24.6% { transform: translate(0px, 32px) scaleY(2.7); }
	26.4% { transform: translate(0px, 32px) scaleY(2.7); }

	84.6% { transform: translate(0px, 0px) scaleY(1); }
}
@keyframes snailHead {
	21.9% { transform: translateY(0px); }
	22.2% { transform: translateY(4px); }
	22.5% { transform: translateY(26px); }
	22.8% { transform: translateY(54px); }
	23.1% { transform: translateY(68px); }
	23.4% { transform: translateY(79px); }
	23.7% { transform: translateY(93px); }
	24.0% { transform: translateY(105px); }
	24.3% { transform: translateY(119px); }
	24.6% { transform: translateY(116px); }
	24.9% { transform: translateY(100px); }
	26.4% { transform: translateY(100px); opacity: 1; }
	26.5% { opacity: 0; }

	87.6% { transform: translateY(10px); opacity: 0; }
	88.2% { transform: translateY(0px); opacity: 1; }
	100%  { opacity: 1; }
}
@keyframes snailSpike1 {
	21.9% { transform: rotate(79deg) translateY(0px); opacity: 1; }
	22.2% { transform: rotate(79deg) translateY(0px); opacity: 0; }
	22.5% { transform: rotate(5deg) translate(-34px, -51px); opacity: 1; }
	22.8% { transform: rotate(0deg) translate(-32px, -58px); opacity: 1; }
	23.1% { transform: rotate(0deg) translate(-34px, -54px); opacity: 1; }
	23.4% { transform: rotate(0deg) translate(-34px, -52px); opacity: 1; }
	24.6% { transform: rotate(0deg) translate(-34px, -52px); opacity: 1; }
	24.9% { transform: rotate(41deg) translate(55px, 82px); opacity: 1; }
	26.4% { transform: rotate(41deg) translate(55px, 82px); opacity: 1; }

	84.6% { transform: rotate(79deg) translate(0px, 0px); opacity: 1; }
}
@keyframes snailSpike2 {
	21.9% { transform: rotate(90deg) translateY(0px); opacity: 1; }
	22.2% { transform: rotate(90deg) translateY(0px); opacity: 0; }
	22.5% { transform: rotate(90deg) translateY(0px); opacity: 0; }
	22.8% { transform: rotate(19deg) translate(-53px, -84px); opacity: 1; }
	23.1% { transform: rotate(5deg) translate(-42px, -104px); opacity: 1; }
	23.4% { transform: rotate(0deg) translate(-35px, -101px); opacity: 1; }
	24.3% { transform: rotate(0deg) translate(-35px, -101px); opacity: 1; }
	24.6% { transform: rotate(0deg) translate(-35px, -96px); opacity: 1; }
	24.9% { transform: rotate(-38deg) translate(-68px, 74px); opacity: 1; }
	26.4% { transform: rotate(-38deg) translate(-68px, 74px); opacity: 1; }

	84.6% { transform: rotate(90deg) translate(0px, 0px); opacity: 1; }
}
@keyframes snailTailSpike {
	0.0%  { opacity: 1; }
	84.5% { opacity: 1; }
	84.6% { opacity: 0; }
	87.6% { opacity: 0; }
	88.2% { opacity: 1; }
	100%  { opacity: 1; }
}

@keyframes piggy {
	0.0%  { opacity: 0; }
	20.3% { opacity: 0; }
	20.4% { opacity: 1; }
	34.8% { transform: scaleX(1)    scaleY(1)    translate(0px, 0px)    skew(0deg); }
	37.2% { transform: scaleX(0.75) scaleY(1.25) translate(7px, 0px)    skew(0deg); }
	39.0% { transform: scaleX(0.75) scaleY(1.25) translate(7px, 0px)    skew(0deg); }
	40.2% { transform: scaleX(1.1)  scaleY(0.9)  translate(-3px, 0px)   skew(0deg); }
	41.1% { transform: scaleX(0.95) scaleY(1.05) translate(1px, 0px)    skew(0deg); }
	41.7% { transform: scaleX(1.03) scaleY(0.97) translate(0px, 0px)    skew(0deg); }
	42.3% { transform: scaleX(1)    scaleY(1)    translate(0px, 0px)    skew(0deg); }
	47.7% { transform: scaleX(1)    scaleY(1)    translate(0px, 0px)    skew(0deg); }
	48.6% { transform: scaleX(1)    scaleY(1.03) translate(0px, 0px)    skew(-6deg); }
	49.5% { transform: scaleX(1)    scaleY(1)    translate(0px, 0px)    skew(7deg); }
	50.4% { transform: scaleX(1)    scaleY(1)    translate(0px, 0px)    skew(-4deg); }
	51.0% { transform: scaleX(1)    scaleY(1)    translate(-13px, 0px)  skew(-2deg); }
	51.3% { transform: scaleX(1)    scaleY(1)    translate(-21px, 0px)  skew(0deg); }
	51.6% { transform: scaleX(1)    scaleY(1)    translate(-31px, 0px)  skew(4deg); }
	51.9% { transform: scaleX(1)    scaleY(1)    translate(-43px, 0px)  skew(0deg); }
	52.2% { transform: scaleX(1)    scaleY(1)    translate(-54px, 0px)  skew(0deg); }
	52.5% { transform: scaleX(1)    scaleY(1)    translate(-64px, 0px)  skew(0deg); }
	52.8% { transform: scaleX(1)    scaleY(1)    translate(-75px, 0px)  skew(0deg); }
	53.1% { transform: scaleX(1)    scaleY(1)    translate(-86px, 0px)  skew(0deg); }
	53.4% { transform: scaleX(1)    scaleY(1)    translate(-96px, 0px)  skew(0deg); }
	53.7% { transform: scaleX(1)    scaleY(1)    translate(-104px, 0px) skew(5deg); }
	54.0% { transform: scaleX(1)    scaleY(1)    translate(-117px, 0px) skew(2deg); }
	54.3% { transform: scaleX(1)    scaleY(1)    translate(-129px, 0px) skew(0deg); }
	54.6% { transform: scaleX(1)    scaleY(1)    translate(-140px, 0px) skew(0deg); }
	54.9% { transform: scaleX(1)    scaleY(1)    translate(-150px, 0px) skew(0deg); }
	55.2% { transform: scaleX(1)    scaleY(1)    translate(-161px, 0px) skew(0deg); }
	55.5% { transform: scaleX(1)    scaleY(1)    translate(-171px, 0px) skew(0deg); }
	63.9% { transform: scaleX(1)    scaleY(1)    translate(-471px, 0px) skew(0deg); opacity: 1; }
	64.0% { opacity: 0; }
	100%  { opacity: 0; }
}
@keyframes piggyBody {
	0.0%  { transform: translate(-210px, 18px); }
	20.4% { transform: translate(-210px, 18px); }
	21.3% { transform: translate(0px, 18px); }
	22.2% { transform: translate(0px, 18px); }
	23.7% { transform: translate(0px, 0px); }
	100%  { transform: translate(0px, 0px); }
}
@keyframes piggyFrontLegs {
	0.0%  { transform: translate(-210px, 0px); }
	20.4% { transform: translate(-210px, 0px); }
	21.3% { transform: translate(0px, 0px); }
	100%  { transform: translate(0px, 0px); }
}
@keyframes piggyBackLegs {
	0.0%  { transform: translate(-210px, 0px); }
	20.4% { transform: translate(-210px, 0px); }
	21.3% { transform: translate(0px, 0px); }
	100%  { transform: translate(0px, 0px); }
}
@keyframes piggyRightEar {
	0.0%  { transform: rotate(-110deg) translate(-100px, 170px); }
	26.1% { transform: rotate(-110deg) translate(-100px, 170px); }
	27.3% { transform: rotate(0deg) translate(0px, 0px); }
	48.6% { transform: rotate(0deg) translate(0px, 0px); }
	49.5% { transform: rotate(3deg) translate(4px, 1px); }
	50.4% { transform: rotate(3deg) translate(-3px, -1px); }
	51.0% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes piggyLeftEar {
	0.0%  { transform: rotate(120deg) translate(110px, 100px); }
	26.1% { transform: rotate(120deg) translate(110px, 100px); }
	27.3% { transform: rotate(0deg) translate(0px, 0px); }
	30.3% { transform: rotate(0deg) translate(0px, 0px); }
	47.7% { transform: rotate(0deg) translate(0px, 0px); }
	48.6% { transform: rotate(10deg) translate(2px, -5px); }
	49.5% { transform: rotate(13deg) translate(2px, 3px); }
	50.4% { transform: rotate(3deg) translate(-3px, -5px); }
	51.0% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes piggyHair {
	0.0%  { transform: rotate(201deg) translate(19px, -97px); }
	30.3% { transform: rotate(201deg) translate(19px, -97px); }
	31.8% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes piggyTail {
	0.0%  { transform: rotate(50deg) translate(81px, 30px); }
	30.3% { transform: rotate(50deg) translate(81px, 30px); }
	31.8% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}
@keyframes piggyRightEye {
	0.0%  { opacity: 0; }
	34.8% { opacity: 0; }
	36.3% { opacity: 1; }
	48.0% { background: #1a2530; }
	49.2% { background: #29a58c; }
	53.7% { background: #29a58c; }
	54.0% { background: #1a2530; }
	100%  { opacity: 1; }
}
@keyframes piggyLeftEye {
	0.0%  { opacity: 0; }
	35.4% { opacity: 0; }
	36.9% { opacity: 1; }
	48.0% { background: #1a2530; }
	49.2% { background: #29a58c; }
	53.7% { background: #29a58c; }
	54.0% { background: #1a2530; }
	100%  { opacity: 1; }
}
@keyframes piggyMouth {
	0.0%  { transform: scale(0); }
	35.4% { transform: scale(0); }
	36.6% { transform: scale(1); }
	100%  { transform: scale(1); }
}
@keyframes piggyCheekRight {
	0.0%  { transform: scale(1.2); }
	36.6% { transform: scale(1.2); }
	37.2% { transform: scale(1); }
	38.1% { transform: scale(1.1); }
	38.7% { transform: scale(1); }
	100%  { transform: scale(1); }
}
@keyframes piggyCheekLeft {
	0.0%  { transform: scale(0.7); }
	36.6% { transform: scale(0.7); }
	37.2% { transform: scale(1.2); }
	38.1% { transform: scale(0.8); }
	38.7% { transform: scale(1); }
	100%  { transform: scale(1); }
}
@keyframes piggyFirstLeg {
	0.0%  { transform: rotate(0deg); }
	50.4% { transform: rotate(0deg); }
	51.0% { transform: rotate(-12deg); }
	51.3% { transform: rotate(-3deg) translateY(-4px); }
	51.6% { transform: rotate(-3deg) translateY(-7px); }
	51.9% { transform: rotate(6deg) translateY(-7px); }
	52.2% { transform: rotate(6deg) translateY(-7px); }
	52.5% { transform: rotate(12deg) translateY(-4px); }
	52.8% { transform: rotate(4deg) translateY(0px); }
	53.1% { transform: rotate(-11deg) translateY(0px); }
	53.4% { transform: rotate(0deg) translateY(0px); }
	54.0% { transform: rotate(-12deg); }
	54.3% { transform: rotate(-3deg) translateY(-4px); }
	54.6% { transform: rotate(-3deg) translateY(-7px); }
	54.9% { transform: rotate(6deg) translateY(-7px); }
	55.2% { transform: rotate(6deg) translateY(-7px); }
	55.5% { transform: rotate(12deg) translateY(-4px); }
	55.8% { transform: rotate(4deg) translateY(0px); }
	56.1% { transform: rotate(-11deg) translateY(0px); }
	57.4% { transform: rotate(0deg) translateY(0px); }
	58.0% { transform: rotate(0deg); }
	58.3% { transform: rotate(-12deg); }
	58.6% { transform: rotate(-3deg) translateY(-4px); }
	58.9% { transform: rotate(-3deg) translateY(-7px); }
	59.2% { transform: rotate(6deg) translateY(-7px); }
	59.5% { transform: rotate(6deg) translateY(-7px); }
	59.8% { transform: rotate(12deg) translateY(-4px); }
	60.1% { transform: rotate(4deg) translateY(0px); }
	60.4% { transform: rotate(-11deg) translateY(0px); }
	60.7% { transform: rotate(0deg) translateY(0px); }
	61.0% { transform: rotate(-12deg); }
	61.3% { transform: rotate(-3deg) translateY(-4px); }
	61.6% { transform: rotate(-3deg) translateY(-7px); }
	61.9% { transform: rotate(6deg) translateY(-7px); }
	62.2% { transform: rotate(6deg) translateY(-7px); }
	62.5% { transform: rotate(12deg) translateY(-4px); }
	62.8% { transform: rotate(4deg) translateY(0px); }
	63.1% { transform: rotate(-11deg) translateY(0px); }
	63.4% { transform: rotate(0deg) translateY(0px); }
	100%  { transform: rotate(0deg) translateY(0px); }
}
@keyframes piggySecondLeg {
	0.0%  { transform: rotate(-11deg) translateY(0px); }
	51.6% { transform: rotate(-11deg) translateY(0px); }
	51.9% { transform: rotate(-13deg) translateY(0px); }
	52.2% { transform: rotate(-35deg) translateY(0px); }
	52.5% { transform: rotate(-37deg) translateY(-3px); }
	52.8% { transform: rotate(-37deg) translateY(-3px); }
	53.1% { transform: rotate(-7deg) translateY(-3px); }
	53.4% { transform: rotate(2deg) translateY(-3px); }
	53.7% { transform: rotate(-8deg) translateY(-1px); }
	54.0% { transform: rotate(0deg) translateY(-1px); }
	54.3% { transform: rotate(-11deg) translateY(0px); }
	54.6% { transform: rotate(-13deg) translateY(0px); }
	54.9% { transform: rotate(-35deg) translateY(0px); }
	55.2% { transform: rotate(-37deg) translateY(-3px); }
	55.5% { transform: rotate(-37deg) translateY(-3px); }
	55.8% { transform: rotate(-7deg) translateY(-3px); }
	56.1% { transform: rotate(2deg) translateY(-3px); }
	56.4% { transform: rotate(-8deg) translateY(-1px); }
	56.7% { transform: rotate(0deg) translateY(-1px); }
	57.0% { transform: rotate(-11deg) translateY(0px); }
	57.3% { transform: rotate(-13deg) translateY(0px); }
	57.6% { transform: rotate(-35deg) translateY(0px); }
	57.9% { transform: rotate(-37deg) translateY(-3px); }
	58.2% { transform: rotate(-37deg) translateY(-3px); }
	58.5% { transform: rotate(-7deg) translateY(-3px); }
	58.8% { transform: rotate(2deg) translateY(-3px); }
	59.1% { transform: rotate(-8deg) translateY(-1px); }
	59.4% { transform: rotate(0deg) translateY(-1px); }
	59.7% { transform: rotate(-11deg) translateY(0px); }
	60.0% { transform: rotate(-13deg) translateY(0px); }
	60.3% { transform: rotate(-35deg) translateY(0px); }
	60.6% { transform: rotate(-37deg) translateY(-3px); }
	60.9% { transform: rotate(-37deg) translateY(-3px); }
	61.2% { transform: rotate(-7deg) translateY(-3px); }
	61.5% { transform: rotate(2deg) translateY(-3px); }
	61.8% { transform: rotate(-8deg) translateY(-1px); }
	62.1% { transform: rotate(0deg) translateY(-1px); }
	100%  { transform: rotate(0deg) translateY(-1px); }
}
@keyframes piggyThirdLeg {
	0.0%  { transform: rotate(0deg) translateY(0px); }
	49.9%  { transform: rotate(0deg) translateY(0px); }
	51.3% { transform: rotate(0deg) translateY(-7px); }
	51.6% { transform: rotate(-10deg) translateY(-10px); }
	51.9% { transform: rotate(-10deg) translateY(-10px); }
	52.2% { transform: rotate(5deg) translateY(-3px); }
	52.5% { transform: rotate(2deg) translateY(0px); }
	52.8% { transform: rotate(-18deg) translateY(0px); }
	53.1% { transform: rotate(-28deg) translateY(0px); }
	53.7% { transform: rotate(-28deg) translateY(0px); }
	54.0% { transform: rotate(-18deg) translateY(0px); }
	54.3% { transform: rotate(0deg) translateY(-3px); }
	54.6% { transform: rotate(0deg) translateY(0px); }
	54.9%  { transform: rotate(0deg) translateY(0px); }
	55.2% { transform: rotate(0deg) translateY(-7px); }
	55.5% { transform: rotate(-10deg) translateY(-10px); }
	55.8% { transform: rotate(-10deg) translateY(-10px); }
	56.1% { transform: rotate(5deg) translateY(-3px); }
	56.4% { transform: rotate(2deg) translateY(0px); }
	56.7% { transform: rotate(-18deg) translateY(0px); }
	57.0% { transform: rotate(-28deg) translateY(0px); }
	57.3% { transform: rotate(-28deg) translateY(0px); }
	57.6% { transform: rotate(-18deg) translateY(0px); }
	57.9% { transform: rotate(0deg) translateY(-3px); }
	58.2% { transform: rotate(0deg) translateY(0px); }
	58.5%  { transform: rotate(0deg) translateY(0px); }
	58.8% { transform: rotate(0deg) translateY(-7px); }
	59.1% { transform: rotate(-10deg) translateY(-10px); }
	59.4% { transform: rotate(-10deg) translateY(-10px); }
	59.7% { transform: rotate(5deg) translateY(-3px); }
	60.0% { transform: rotate(2deg) translateY(0px); }
	60.3% { transform: rotate(-18deg) translateY(0px); }
	60.6% { transform: rotate(-28deg) translateY(0px); }
	60.9% { transform: rotate(-28deg) translateY(0px); }
	61.2% { transform: rotate(-18deg) translateY(0px); }
	61.5% { transform: rotate(0deg) translateY(-3px); }
	61.8% { transform: rotate(0deg) translateY(0px); }
	62.1%  { transform: rotate(0deg) translateY(0px); }
	62.4% { transform: rotate(0deg) translateY(-7px); }
	62.7% { transform: rotate(-10deg) translateY(-10px); }
	63.0% { transform: rotate(-10deg) translateY(-10px); }
	63.3% { transform: rotate(5deg) translateY(-3px); }
	63.6% { transform: rotate(2deg) translateY(0px); }
	63.9% { transform: rotate(-18deg) translateY(0px); }
	64.2% { transform: rotate(-28deg) translateY(0px); }
	64.5% { transform: rotate(-28deg) translateY(0px); }
	64.8% { transform: rotate(-18deg) translateY(0px); }
	65.1% { transform: rotate(0deg) translateY(-3px); }
	65.4% { transform: rotate(0deg) translateY(0px); }
	100%  { transform: rotate(0deg) translateY(0px); }
}
@keyframes piggyFourthLeg {
	0.0%  { transform: rotate(0deg) translate(0px, 0px); }
	51.9% { transform: rotate(0deg) translate(0px, 0px); }
	52.2% { transform: rotate(-10deg) translate(0px, -1px); }
	52.5% { transform: rotate(-11deg) translate(0px, 0px); }
	52.8% { transform: rotate(-5deg) translate(0px, 0px); }
	53.1% { transform: rotate(0deg) translate(0px, 0px); }
	54.6% { transform: rotate(0deg) translate(0px, 0px); }
	54.9% { transform: rotate(13deg) translate(0px, -7px); }
	55.2% { transform: rotate(13deg) translate(0px, -5px); }
	55.5% { transform: rotate(0deg) translate(0px, 0px); }
	55.8% { transform: rotate(0deg) translate(0px, 0px); }
	56.1% { transform: rotate(-10deg) translate(0px, -1px); }
	56.4% { transform: rotate(-11deg) translate(0px, 0px); }
	56.7% { transform: rotate(-5deg) translate(0px, 0px); }
	57.0% { transform: rotate(0deg) translate(0px, 0px); }
	57.3% { transform: rotate(0deg) translate(0px, 0px); }
	57.6% { transform: rotate(13deg) translate(0px, -7px); }
	57.9% { transform: rotate(13deg) translate(0px, -5px); }
	58.2% { transform: rotate(0deg) translate(0px, 0px); }
	58.5% { transform: rotate(0deg) translate(0px, 0px); }
	58.8% { transform: rotate(-10deg) translate(0px, -1px); }
	59.1% { transform: rotate(-11deg) translate(0px, 0px); }
	59.4% { transform: rotate(-5deg) translate(0px, 0px); }
	59.7% { transform: rotate(0deg) translate(0px, 0px); }
	60.0% { transform: rotate(0deg) translate(0px, 0px); }
	60.3% { transform: rotate(13deg) translate(0px, -7px); }
	60.6% { transform: rotate(13deg) translate(0px, -5px); }
	60.9% { transform: rotate(0deg) translate(0px, 0px); }
	61.2% { transform: rotate(0deg) translate(0px, 0px); }
	61.5% { transform: rotate(-10deg) translate(0px, -1px); }
	61.8% { transform: rotate(-11deg) translate(0px, 0px); }
	62.1% { transform: rotate(-5deg) translate(0px, 0px); }
	62.4% { transform: rotate(0deg) translate(0px, 0px); }
	62.7% { transform: rotate(0deg) translate(0px, 0px); }
	63.0% { transform: rotate(13deg) translate(0px, -7px); }
	63.3% { transform: rotate(13deg) translate(0px, -5px); }
	63.6% { transform: rotate(0deg) translate(0px, 0px); }
	100%  { transform: rotate(0deg) translate(0px, 0px); }
}

@keyframes wasp {
	0.0%  { opacity: 0; }
	56.1% { opacity: 0; }
	56.4% { opacity: 1; }
	81.6% { transform: translate(0px, 0px); }
	82.2% { transform: translate(0px, -8px); }
	82.8% { transform: translate(43px, -30px); }
	83.4% { transform: translate(65px, -32px); }
	84.0% { transform: translate(96px, -12px); }
	84.6% { transform: translate(125px, 30px); }
	84.9% { transform: translate(142px, 0px); }
	85.5% { transform: translate(193px, -29px); }
	87.9% { transform: translate(253px, 274px); opacity: 1; }
	88.2% { opacity: 0; }
	100%  { opacity: 0; }
}
@keyframes waspLegs {
	56.4% { transform: translate(210px, -11px) rotate(-100deg); }
	57.9% { transform: translate(0px, 0px) rotate(0deg); }
	76.2% { transform: translate(0px, 0px) rotate(0deg); }
	76.5% { transform: translate(0px, 0px) rotate(0deg); }
	76.8% { transform: translate(0px, 0px) rotate(0deg); }
	77.1% { transform: translate(0px, 0px) rotate(0deg); }
	77.7% { transform: translate(0px, 0px) rotate(0deg); }
	78.9% { transform: translate(0px, 0px) rotate(0deg); }
	80.4% { transform: translate(0px, 0px) rotate(0deg); }
	81.6% { transform: translate(0px, 0px) rotate(0deg); }
	82.2% { transform: translate(-2px, -4px) rotate(15deg); }
	83.4% { transform: translate(37px, -9px) rotate(1deg); }
	84.0% { transform: translate(44px, 0px) rotate(-10deg); }
	84.6% { transform: translate(25px, -30px) rotate(0deg); }
	84.9% { transform: translate(25px, -30px) rotate(0deg); }
	85.5% { transform: translate(25px, -30px) rotate(0deg); }
	87.9% { transform: translate(25px, -30px) rotate(0deg); }
}
@keyframes waspBody {
	59.7% { transform: translate(-230px, 33px) rotate(180deg); }
	61.5% { transform: translate(0px, 0px) rotate(0deg); }
	75.9% { transform: translate(0px, 0px) rotate(0deg); }
	76.2% { transform: translate(6px, 6px) rotate(4deg); }
	76.5% { transform: translate(11px, 11px) rotate(7deg); }
	76.8% { transform: translate(13px, 14px) rotate(8deg); }
	77.1% { transform: translate(13px, 15px) rotate(4deg); }
	77.7% { transform: translate(8px, 14px) rotate(-7deg); }
	78.9% { transform: translate(-3px, -6px) rotate(-7deg); }
	80.4% { transform: translate(0px, 0px) rotate(0deg); }
	81.6% { transform: translate(-9px, 12px) rotate(6deg); }
	82.2% { transform: translate(19px, -16px) rotate(6deg); }
	82.8% { transform: translate(19px, -16px) rotate(6deg); }
	83.4% { transform: translate(19px, -16px) rotate(6deg); }
	84.0% { transform: translate(19px, -16px) rotate(6deg); }
	84.6% { transform: translate(19px, -16px) rotate(4deg); }
	84.9% { transform: translate(19px, -16px) rotate(4deg); }
	85.5% { transform: translate(19px, -16px) rotate(4deg); }
	87.9% { transform: translate(19px, -16px) rotate(4deg); }
}
@keyframes waspWing {
	65.1% { transform: rotate(-170deg) translate(-150px, 50px); }
	66.6% { transform: rotate(28deg) translate(0px, 0px); }
	75.9% { transform: rotate(28deg) translate(0px, 0px) rotateX(0deg); }
	76.2% { transform: rotate(28deg) translate(10px, 3px) rotateX(-100deg); }
	76.5% { transform: rotate(-2deg) translate(12px, 14px) rotateX(-150deg); }
	76.8% { transform: rotate(18deg) translate(20px, 12px) rotateX(-50deg); }
	77.1% { transform: rotate(30deg) translate(23px, 10px) rotateX(0deg); }
	77.7% { transform: rotate(-21deg) translate(0px, 13px) rotateX(-140deg); }
	78.3% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	78.9% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	79.5% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	80.1% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	80.7% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	82.2% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	82.5% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	83.1% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	83.4% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	84.0% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	85.2% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	85.5% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	86.1% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
	86.4% { transform: rotate(-21deg) translate(0px, 3px) rotateX(-140deg); }
	87.0% { transform: rotate(30deg) translate(3px, 0px) rotateX(0deg); }
}
@keyframes waspLegKnee {
	76.2% { transform: rotate(146deg); }
	76.5% { transform: rotate(161deg); }
	76.8% { transform: rotate(171deg); }
	77.1% { transform: rotate(171deg); }
	77.7% { transform: rotate(171deg); }
	78.9% { transform: rotate(171deg); }
	80.4% { transform: rotate(146deg); }
	81.6% { transform: rotate(86deg); }
	82.2% { transform: rotate(222deg); }
	82.8% { transform: rotate(182deg); }
	83.4% { transform: rotate(127deg); }
	84.0% { transform: rotate(147deg); }
	84.6% { transform: rotate(127deg); }
	84.9% { transform: rotate(221deg); }
	85.5% { transform: rotate(161deg); }
	87.9% { transform: rotate(201deg); }
}
@keyframes waspLegHip {
	75.9% { transform: rotate(124deg); }
	76.2% { transform: rotate(134deg); }
	76.5% { transform: rotate(134deg); }
	76.8% { transform: rotate(134deg); }
	77.1% { transform: rotate(134deg); }
	77.7% { transform: rotate(134deg); }
	78.9% { transform: rotate(94deg); }
	80.4% { transform: rotate(123deg); }
	81.6% { transform: rotate(153deg); }
	82.2% { transform: rotate(0deg); }
	82.8% { transform: rotate(50deg); }
	83.4% { transform: rotate(112deg); }
	84.0% { transform: rotate(70deg); }
	84.6% { transform: rotate(157deg); }
	84.9% { transform: rotate(120deg); }
	87.9% { transform: rotate(0deg); }
}
@keyframes waspEye {
	75.9% { background: #012135; }
	78.6% { background: #29a58c; }
	84.0% { background: #012135; }
}

@keyframes soul {
	0.0%  { transform: scale(0, 0); }
	8.1%  { transform: scale(0, 0); }
	12.0% { transform: scale(1, 1); }
	100%  { transform: scale(1, 1); }
}
@keyframes soulPart1 {
	0.0%  { transform: translate(8px, 16px) rotate(0deg); }
	12.0% { transform: translate(8px, 16px) rotate(0deg); }
	12.9% { transform: translate(3px, 17px) rotate(0deg); }
	14.4% { transform: translate(-3px, 15px) rotate(0deg); }
	15.9% { transform: translate(-4px, 8px) rotate(0deg); }
	18.0% { transform: translate(-4px, 8px) rotate(0deg); }
	18.3% { transform: translate(6px, 18px) rotate(0deg); }
	20.7% { transform: translate(0px, -2px) rotate(0deg); }
	24.3% { transform: translate(-3px, -3px) rotate(0deg); }
	26.1% { transform: translate(-2px, -9px) rotate(0deg); }
	26.4% { transform: translate(-2px, -16px) rotate(0deg); }
	29.1% { transform: translate(-2px, -16px) rotate(0deg); }
	29.4% { transform: translate(18px, 34px) rotate(0deg); }
	31.5% { transform: translate(2px, 28px) rotate(0deg); }
	34.5% { transform: translate(6px, 21px) rotate(0deg); }
	36.3% { transform: translate(57px, 46px) rotate(0deg); }
	39.6% { transform: translate(56px, 23px) rotate(0deg); }
	42.3% { transform: translate(53px, 19px) rotate(0deg); }
	43.8% { transform: translate(51px, 24px) rotate(0deg); }
	44.1% { transform: translate(34px, 39px) rotate(0deg); }
	44.4% { transform: translate(34px, 35px) rotate(0deg); }
	44.7% { transform: translate(34px, 23px) rotate(0deg); }
	45.0% { transform: translate(34px, 1px) rotate(0deg); }
	45.3% { transform: translate(43px, -15px) rotate(0deg); }
	45.6% { transform: translate(36px, -47px) rotate(20deg); }
	45.9% { transform: translate(66px, -65px) rotate(90deg); }
	46.2% { transform: translate(100px, -48px) rotate(140deg); }
	46.5% { transform: translate(140px, -18px) rotate(150deg); }
	100%  { transform: translate(140px, -18px) rotate(150deg); }
}
@keyframes soulPart1Before {
	0.0%  { transform: scale(1, 0.7); }
	12.0% { transform: scale(1, 0.7); }
	12.9% { transform: scale(1, 0.7); }
	14.4% { transform: scale(0.9, 0.6); }
	15.9% { transform: scale(0.4, 0.6); }
	18.0% { transform: scale(0, 0); }
	20.7% { transform: scale(1, 0.7); }
	24.3% { transform: scale(1, 0.7); }
	26.1% { transform: scale(0.4, 0.3); }
	26.4% { transform: scale(0, 0); }
	29.1% { transform: scale(0, 0); }
	31.5% { transform: scale(4, 2.9); }
	34.5% { transform: scale(4, 2); }
	36.3% { transform: scale(4, 3.4); }
	39.6% { transform: scale(4, 3.8); }
	42.3% { transform: scale(4, 4); }
	43.8% { transform: scale(4, 5); }
	44.1% { transform: scale(9, 7); }
	44.7% { transform: scale(9, 7); }
	45.0% { transform: scale(8, 7); }
	45.3% { transform: scale(3, 3); }
	45.9% { transform: scale(3, 3); }
	46.2% { transform: scale(2, 3); }
	46.5% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart2 {
	0.0%  { transform: translate(8px, 8px) rotate(0deg); }
	12.0% { transform: translate(8px, 8px) rotate(0deg); }
	12.9% { transform: translate(3px, 9px) rotate(0deg); }
	14.4% { transform: translate(-3px, 9px) rotate(0deg); }
	15.9% { transform: translate(-5px, 7px) rotate(0deg); }
	18.0% { transform: translate(-2px, 1px) rotate(0deg); }
	20.7% { transform: translate(-1px, 1px) rotate(0deg); }
	24.3% { transform: translate(-4px, 5px) rotate(0deg); }
	26.1% { transform: translate(-3px, 3px) rotate(0deg); }
	29.1% { transform: translate(-1px, 0px) rotate(0deg); }
	31.5% { transform: translate(-1px, 3px) rotate(0deg); }
	34.5% { transform: translate(-4px, 5px) rotate(0deg); }
	36.3% { transform: translate(-3px, 2px) rotate(0deg); }
	39.6% { transform: translate(-1px, -1px) rotate(0deg); }
	42.3% { transform: translate(-3px, 5px) rotate(0deg); }
	43.8% { transform: translate(-4px, 5px) rotate(0deg); }
	44.1% { transform: translate(-3px, 4px) rotate(0deg); }
	44.4% { transform: translate(-2px, 0px) rotate(0deg); }
	44.7% { transform: translate(2px, -12px) rotate(0deg); }
	45.0% { transform: translate(7px, -32px) rotate(0deg); }
	45.3% { transform: translate(10px, -59px) rotate(-6deg); }
	45.6% { transform: translate(16px, -93px) rotate(14deg); }
	45.9% { transform: translate(42px, -131px) rotate(51deg); }
	46.2% { transform: translate(91px, -135px) rotate(111deg); }
	46.5% { transform: translate(142px, -101px) rotate(145deg); }
	46.8% { transform: translate(166px, -47px) rotate(170deg); }
	47.1% { transform: translate(174px, 3px) rotate(177deg); }
	47.4% { transform: translate(183px, 44px) rotate(167deg); }
	47.7% { transform: translate(204px, 66px) rotate(137deg); }
	48.0% { transform: translate(224px, 75px) rotate(87deg); }
	48.3% { transform: translate(239px, 81px) rotate(87deg); }
	48.6% { transform: translate(245px, 88px) rotate(87deg); }
	48.9% { transform: translate(250px, 93px) rotate(87deg); }
	49.2% { transform: translate(250px, 93px) rotate(87deg); }
	100%  { transform: translate(250px, 93px) rotate(87deg); }
}
@keyframes soulPart2Before {
	0.0%  { transform: scale(1, 1); }
	14.4% { transform: scale(1, 1); }
	15.9% { transform: scale(1.4, 1); }
	18.0% { transform: scale(1.4, 1); }
	20.7% { transform: scale(1, 1); }
	24.3% { transform: scale(1.2, 1); }
	26.1% { transform: scale(1.4, 1.2); }
	29.1% { transform: scale(1.1, 1); }
	31.5% { transform: scale(1.1, 1); }
	34.5% { transform: scale(1.3, 1); }
	36.3% { transform: scale(1.3, 1.3); }
	39.6% { transform: scale(1, 1); }
	42.3% { transform: scale(1, 1); }
	43.8% { transform: scale(1.2, 1); }
	44.1% { transform: scale(1.2, 1.2); }
	44.4% { transform: scale(1.2, 1.2); }
	44.7% { transform: scale(1, 1.5); }
	45.0% { transform: scale(1, 1.8); }
	45.3% { transform: scale(0.7, 1.8); }
	45.6% { transform: scale(0.5, 2); }
	45.9% { transform: scale(0.3, 2.4); }
	46.2% { transform: scale(0.4, 2.4); }
	46.5% { transform: scale(0.4, 2.4); }
	46.8% { transform: scale(0.6, 2); }
	47.1% { transform: scale(0.6, 1.5); }
	47.4% { transform: scale(0.6, 1.5); }
	47.7% { transform: scale(0.6, 1); }
	48.0% { transform: scale(0.6, 1); }
	48.3% { transform: scale(0.4, 0.6); }
	48.6% { transform: scale(0.3, 0.3); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart3 {
	0.0%  { transform: translate(-15px, 50px) rotate(0deg); }
	12.0% { transform: translate(-15px, 50px) rotate(0deg); }
	12.9% { transform: translate(-2px, 51px) rotate(0deg); }
	14.4% { transform: translate(3px, 39px) rotate(0deg); }
	15.9% { transform: translate(5px, 31px) rotate(0deg); }
	18.0% { transform: translate(2px, 12px) rotate(0deg); }
	20.7% { transform: translate(1px, -2px) rotate(0deg); }
	21.9% { transform: translate(-9px, 28px) rotate(0deg); }
	24.3% { transform: translate(4px, 24px) rotate(0deg); }
	26.1% { transform: translate(3px, 17px) rotate(0deg); }
	29.1% { transform: translate(0px, 2px) rotate(0deg); }
	31.5% { transform: translate(3px, -3px) rotate(0deg); }
	36.3% { transform: translate(3px, -3px) rotate(0deg); }
	39.6% { transform: translate(-29px, 17px) rotate(0deg); }
	42.3% { transform: translate(-28px, -9px) rotate(0deg); }
	43.8% { transform: translate(-28px, -9px) rotate(0deg); }
	44.1% { transform: translate(-31px, -5px) rotate(0deg); }
	44.4% { transform: translate(-28px, -16px) rotate(50deg); }
	44.7% { transform: translate(-23px, -38px) rotate(120deg); }
	45.0% { transform: translate(7px, -53px) rotate(190deg); }
	45.3% { transform: translate(48px, -36px) rotate(220deg); }
	45.6% { transform: translate(79px, 3px) rotate(250deg); }
	45.9% { transform: translate(91px, 56px) rotate(263deg); }
	46.2% { transform: translate(97px, 95px) rotate(260deg); }
	46.5% { transform: translate(113px, 136px) rotate(240deg); }
	46.8% { transform: translate(144px, 165px) rotate(209deg); }
	47.1% { transform: translate(178px, 175px) rotate(186deg); }
	47.4% { transform: translate(202px, 180px) rotate(184deg); }
	47.7% { transform: translate(214px, 181px) rotate(178deg); }
	100%  { transform: translate(214px, 181px) rotate(178deg); }
}
@keyframes soulPart3Before {
	0.0%  { transform: scale(1, 1); }
	12.0% { transform: scale(1, 1); }
	12.9% { transform: scale(1, 1.3); }
	14.4% { transform: scale(1.2, 1.3); }
	15.9% { transform: scale(1.5, 1.3); }
	18.0% { transform: scale(1.3, 1.3); }
	20.7% { transform: scale(0.9, 1); }
	21.6% { transform: scale(0.9, 1); }
	24.3% { transform: scale(1.2, 1.4); }
	26.1% { transform: scale(1.2, 1.4); }
	29.1% { transform: scale(1, 1.2); }
	31.5% { transform: scale(0, 0); }
	39.6% { transform: scale(0, 0); }
	42.3% { transform: scale(1.8, 1.9); }
	44.1% { transform: scale(1.8, 1.9); }
	44.4% { transform: scale(1.7, 1.6); }
	44.7% { transform: scale(2, 1); }
	45.0% { transform: scale(2.2, 0.7); }
	45.3% { transform: scale(2.8, 0.9); }
	45.9% { transform: scale(2.8, 0.9); }
	46.2% { transform: scale(2.4, 0.7); }
	46.5% { transform: scale(2.4, 0.7); }
	46.8% { transform: scale(2, 0.5); }
	47.1% { transform: scale(2, 0.5); }
	47.4% { transform: scale(1.3, 0.7); }
	47.7% { transform: scale(1, 0.5); }
	48.0% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart4 {
	0.0%  { transform: translate(0px, 32px) rotate(0deg); }
	12.9% { transform: translate(0px, 32px) rotate(0deg); }
	14.4% { transform: translate(1px, 37px) rotate(0deg); }
	15.9% { transform: translate(-2px, 37px) rotate(0deg); }
	18.0% { transform: translate(-2px, 37px) rotate(0deg); }
	20.7% { transform: translate(0px, -4px) rotate(0deg); }
	24.3% { transform: translate(1px, 2px) rotate(0deg); }
	26.1% { transform: translate(1px, 22px) rotate(0deg); }
	29.1% { transform: translate(1px, 22px) rotate(0deg); }
	31.5% { transform: translate(0px, 1px) rotate(0deg); }
	34.5% { transform: translate(0px, 1px) rotate(0deg); }
	36.3% { transform: translate(0px, 20px) rotate(0deg); }
	39.6% { transform: translate(0px, 20px) rotate(0deg); }
	42.3% { transform: translate(0px, 3px) rotate(0deg); }
	43.8% { transform: translate(1px, 3px) rotate(0deg); }
	44.1% { transform: translate(0px, 3px) rotate(0deg); }
	44.4% { transform: translate(-1px, 8px) rotate(0deg); }
	44.7% { transform: translate(-5px, -14px) rotate(20deg); }
	45.0% { transform: translate(12px, -44px) rotate(25deg); }
	45.3% { transform: translate(41px, -50px) rotate(80deg); }
	45.6% { transform: translate(52px, -43px) rotate(112deg); }
	45.9% { transform: translate(52px, -43px) rotate(112deg); }
	46.2% { transform: translate(81px, -22px) rotate(138deg); }
	46.5% { transform: translate(111px, 5px) rotate(168deg); }
	100%  { transform: translate(111px, 5px) rotate(168deg); }
}
@keyframes soulPart4Before {
	0.0%  { transform: scale(1, 1); }
	12.0% { transform: scale(1, 1); }
	12.9% { transform: scale(0.6, 1); }
	14.4% { transform: scale(0.6, 1); }
	15.9% { transform: scale(3, 1); }
	18.0% { transform: scale(3, 1); }
	20.7% { transform: scale(1, 0.8); }
	24.3% { transform: scale(0.2, 0.8); }
	29.1% { transform: scale(0.2, 0.8); }
	31.5% { transform: scale(1, 0.8); }
	34.5% { transform: scale(1, 0.8); }
	36.3% { transform: scale(0, 0.8); }
	39.6% { transform: scale(0, 0.8); }
	42.3% { transform: scale(0.7, 0.8); }
	43.8% { transform: scale(0.3, 0.8); }
	44.1% { transform: scale(0.3, 0.8); }
	44.4% { transform: scale(0.5, 0.8); }
	45.0% { transform: scale(0.5, 0.5); }
	45.3% { transform: scale(0.7, 0.6); }
	45.9% { transform: scale(0.7, 1.3); }
	46.2% { transform: scale(0.9, 1.3); }
	46.5% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart5 {
	0.0%  { transform: translate(2px, 24px) rotate(0deg); }
	12.0% { transform: translate(2px, 24px) rotate(0deg); }
	12.9% { transform: translate(2px, 26px) rotate(0deg); }
	14.4% { transform: translate(4px, 27px) rotate(0deg); }
	15.9% { transform: translate(9px, 24px) rotate(0deg); }
	18.0% { transform: translate(6px, 11px) rotate(0deg); }
	20.7% { transform: translate(4px, 3px) rotate(0deg); }
	24.3% { transform: translate(6px, 9px) rotate(0deg); }
	26.1% { transform: translate(8px, 11px) rotate(0deg); }
	29.1% { transform: translate(5px, 5px) rotate(0deg); }
	31.5% { transform: translate(5px, 5px) rotate(0deg); }
	34.5% { transform: translate(9px, 10px) rotate(0deg); }
	36.3% { transform: translate(7px, 11px) rotate(0deg); }
	39.6% { transform: translate(-30px, -11px) rotate(0deg); }
	42.3% { transform: translate(-32px, -15px) rotate(0deg); }
	43.8% { transform: translate(-32px, -15px) rotate(0deg); }
	44.1% { transform: translate(-33px, -17px) rotate(0deg); }
	44.4% { transform: translate(-32px, -27px) rotate(0deg); }
	44.7% { transform: translate(-21px, -55px) rotate(23deg); }
	45.0% { transform: translate(10px, -86px) rotate(53deg); }
	45.3% { transform: translate(59px, -88px) rotate(103deg); }
	45.6% { transform: translate(105px, -57px) rotate(143deg); }
	45.9% { transform: translate(121px, -37px) rotate(153deg); }
	100%  { transform: translate(121px, -37px) rotate(153deg); }
}
@keyframes soulPart5Before {
	0.0%  { transform: scale(0.9, 1); }
	36.3% { transform: scale(0.9, 1); }
	39.6% { transform: scale(0.14, 0.15); }
	43.8% { transform: scale(0.14, 0.15); }
	44.1% { transform: scale(0.1, 0.1); }
	44.4% { transform: scale(0.1, 0.1); }
	44.7% { transform: scale(0.05, 0.15); }
	45.0% { transform: scale(0.05, 0.15); }
	45.3% { transform: scale(0.05, 0.1); }
	45.6% { transform: scale(0.05, 0.1); }
	45.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart6 {
	0.0%  { transform: translate(-10px, 14px) rotate(0deg); }
	12.0% { transform: translate(-10px, 14px) rotate(0deg); }
	12.9% { transform: translate(-6px, 11px) rotate(0deg); }
	14.4% { transform: translate(-5px, 18px) rotate(0deg); }
	15.9% { transform: translate(5px, 32px) rotate(0deg); }
	18.0% { transform: translate(2px, 17px) rotate(0deg); }
	20.7% { transform: translate(2px, 2px) rotate(0deg); }
	24.3% { transform: translate(-2px, 4px) rotate(0deg); }
	26.1% { transform: translate(1px, 24px) rotate(0deg); }
	29.1% { transform: translate(-1px, 7px) rotate(0deg); }
	31.5% { transform: translate(-1px, 0px) rotate(0deg); }
	34.5% { transform: translate(13px, -10px) rotate(0deg); }
	36.3% { transform: translate(12px, -18px) rotate(0deg); }
	39.6% { transform: translate(10px, -32px) rotate(0deg); }
	41.4% { transform: translate(10px, -46px) rotate(0deg); }
	42.3% { transform: translate(-20px, -6px) rotate(0deg); }
	43.8% { transform: translate(12px, -7px) rotate(0deg); }
	44.1% { transform: translate(16px, -11px) rotate(0deg); }
	44.4% { transform: translate(12px, -21px) rotate(0deg); }
	44.7% { transform: translate(6px, -43px) rotate(40deg); }
	45.0% { transform: translate(-6px, -63px) rotate(40deg); }
	45.3% { transform: translate(14px, -74px) rotate(127deg); }
	45.6% { transform: translate(48px, -60px) rotate(130deg); }
	45.9% { transform: translate(78px, -23px) rotate(160deg); }
	46.2% { transform: translate(86px, 17px) rotate(176deg); }
	46.5% { transform: translate(92px, 65px) rotate(166deg); }
	46.8% { transform: translate(110px, 110px) rotate(146deg); }
	47.1% { transform: translate(142px, 141px) rotate(118deg); }
	47.4% { transform: translate(172px, 156px) rotate(108deg); }
	47.7% { transform: translate(182px, 146px) rotate(108deg); }
	100%  { transform: translate(182px, 146px) rotate(108deg); }
}
@keyframes soulPart6Before {
	0.0%  { transform: scale(1, 1); }
	12.0% { transform: scale(1, 1); }
	12.9% { transform: scale(0.9, 1); }
	14.4% { transform: scale(0.9, 1.4); }
	15.9% { transform: scale(0.9, 0.75); }
	18.0% { transform: scale(0.9, 1.1); }
	20.7% { transform: scale(0.9, 1.3); }
	24.3% { transform: scale(0.9, 1.5); }
	26.1% { transform: scale(1, 1); }
	29.1% { transform: scale(1, 1.2); }
	31.5% { transform: scale(1, 1.2); }
	34.5% { transform: scale(0.3, 0.3); }
	36.3% { transform: scale(0.3, 0.3); }
	39.6% { transform: scale(0.2, 0.3); }
	41.4% { transform: scale(0, 0); }
	42.3% { transform: scale(0, 0); }
	43.8% { transform: scale(0.3, 0.4); }
	44.1% { transform: scale(0.3, 0.3); }
	44.4% { transform: scale(0.3, 0.3); }
	44.7% { transform: scale(0.3, 0.4); }
	45.0% { transform: scale(0.15, 0.3); }
	45.3% { transform: scale(0.15, 0.3); }
	45.6% { transform: scale(0.15, 0.4); }
	45.9% { transform: scale(0.1, 0.5); }
	46.2% { transform: scale(0.1, 0.4); }
	47.1% { transform: scale(0.1, 0.4); }
	47.4% { transform: scale(0.1, 0.3); }
	47.7% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart7 {
	0.0%  { transform: translate(-16px, 21px) rotate(0deg); }
	12.0% { transform: translate(-16px, 21px) rotate(0deg); }
	12.9% { transform: translate(-17px, 21px) rotate(0deg); }
	14.4% { transform: translate(-14px, 21px) rotate(0deg); }
	15.9% { transform: translate(-17px, 21px) rotate(0deg); }
	18.0% { transform: translate(-17px, 19px) rotate(0deg); }
	20.7% { transform: translate(-20px, 15px) rotate(0deg); }
	24.3% { transform: translate(-19px, 18px) rotate(0deg); }
	26.1% { transform: translate(-19px, 16px) rotate(0deg); }
	29.1% { transform: translate(-19px, 16px) rotate(0deg); }
	31.5% { transform: translate(-19px, 11px) rotate(0deg); }
	34.5% { transform: translate(-19px, 9px) rotate(0deg); }
	36.3% { transform: translate(-18px, 9px) rotate(0deg); }
	39.6% { transform: translate(-19px, 8px) rotate(0deg); }
	42.3% { transform: translate(-20px, 10px) rotate(0deg); }
	43.8% { transform: translate(-20px, 10px) rotate(0deg); }
	44.1% { transform: translate(-21px, 8px) rotate(0deg); }
	44.4% { transform: translate(-20px, 3px) rotate(0deg); }
	44.7% { transform: translate(-18px, -12px) rotate(0deg); }
	45.0% { transform: translate(-20px, -24px) rotate(-6deg); }
	45.3% { transform: translate(-20px, -50px) rotate(-6deg); }
	45.6% { transform: translate(-18px, -70px) rotate(5deg); }
	45.9% { transform: translate(9px, -96px) rotate(70deg); }
	46.2% { transform: translate(46px, -88px) rotate(110deg); }
	46.5% { transform: translate(80px, -57px) rotate(150deg); }
	46.8% { transform: translate(103px, 7px) rotate(173deg); }
	47.1% { transform: translate(111px, 59px) rotate(173deg); }
	47.4% { transform: translate(149px, 107px) rotate(123deg); }
	47.7% { transform: translate(169px, 117px) rotate(93deg); }
	100%  { transform: translate(169px, 117px) rotate(93deg); }
}
@keyframes soulPart7Before {
	0.0%  { transform: scale(1, 1.5); }
	12.0% { transform: scale(1, 1.5); }
	12.9% { transform: scale(1.3, 1.5); }
	14.4% { transform: scale(1.3, 1.5); }
	15.9% { transform: scale(1.6, 1.5); }
	18.0% { transform: scale(1.4, 1.5); }
	20.7% { transform: scale(1.6, 1.5); }
	24.3% { transform: scale(1.6, 1.5); }
	26.1% { transform: scale(1.8, 1.5); }
	29.1% { transform: scale(1.5, 1.5); }
	31.5% { transform: scale(1.6, 1.9); }
	34.5% { transform: scale(1.8, 2.1); }
	36.3% { transform: scale(2, 2); }
	39.6% { transform: scale(1.6, 2); }
	42.3% { transform: scale(1.7, 2); }
	44.4% { transform: scale(1.7, 2); }
	44.7% { transform: scale(1.6, 2.2); }
	45.0% { transform: scale(1.3, 2); }
	45.3% { transform: scale(1.1, 1.8); }
	45.6% { transform: scale(0.5, 1.2); }
	45.9% { transform: scale(0.4, 1); }
	46.2% { transform: scale(0.37, 1); }
	46.5% { transform: scale(0.37, 1); }
	46.8% { transform: scale(0.7, 1.3); }
	47.4% { transform: scale(0.7, 1.3); }
	47.7% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart8 {
	0.0%  { transform: translate(14px, 10px) rotate(0deg); }
	12.0% { transform: translate(14px, 10px) rotate(0deg); }
	12.9% { transform: translate(11px, 11px) rotate(0deg); }
	14.4% { transform: translate(10px, 10px) rotate(0deg); }
	15.9% { transform: translate(14px, 13px) rotate(0deg); }
	18.0% { transform: translate(16px, -4px) rotate(0deg); }
	20.7% { transform: translate(19px, -11px) rotate(0deg); }
	24.3% { transform: translate(15px, 0px) rotate(0deg); }
	26.1% { transform: translate(13px, 5px) rotate(0deg); }
	29.1% { transform: translate(4px, 6px) rotate(0deg); }
	31.5% { transform: translate(8px, 0px) rotate(0deg); }
	34.5% { transform: translate(14px, -1px) rotate(0deg); }
	36.3% { transform: translate(-3px, 19px) rotate(0deg); }
	39.6% { transform: translate(-3px, 5px) rotate(0deg); }
	42.3% { transform: translate(-3px, 3px) rotate(0deg); }
	43.8% { transform: translate(1px, -1px) rotate(0deg); }
	44.1% { transform: translate(3px, -3px) rotate(0deg); }
	44.4% { transform: translate(4px, -12px) rotate(0deg); }
	44.7% { transform: translate(3px, -34px) rotate(0deg); }
	45.0% { transform: translate(7px, -40px) rotate(0deg); }
	45.3% { transform: translate(26px, -76px) rotate(41deg); }
	45.6% { transform: translate(31px, -82px) rotate(41deg); }
	45.9% { transform: translate(71px, -89px) rotate(101deg); }
	46.2% { transform: translate(101px, -75px) rotate(111deg); }
	46.5% { transform: translate(132px, -37px) rotate(141deg); }
	46.8% { transform: translate(156px, 34px) rotate(171deg); }
	47.1% { transform: translate(164px, 80px) rotate(162deg); }
	47.4% { transform: translate(206px, 125px) rotate(112deg); }
	47.7% { transform: translate(218px, 126px) rotate(112deg); }
	48.0% { transform: translate(229px, 128px) rotate(82deg); }
	48.3% { transform: translate(244px, 131px) rotate(82deg); }
	48.6% { transform: translate(247px, 137px) rotate(82deg); }
	48.9% { transform: translate(239px, 140px) rotate(82deg); }
	100%  { transform: translate(239px, 140px) rotate(82deg); }
}
@keyframes soulPart8Before {
	0.0%  { transform: scale(1, 1); }
	14.4% { transform: scale(1, 1); }
	15.9% { transform: scale(1.6, 1.6); }
	24.3% { transform: scale(1.4, 1.6); }
	26.1% { transform: scale(1.4, 2); }
	29.1% { transform: scale(1.4, 1.4); }
	34.5% { transform: scale(1.4, 1.4); }
	36.3% { transform: scale(1, 0.8); }
	39.6% { transform: scale(1, 1.3); }
	42.3% { transform: scale(1, 0.8); }
	44.4% { transform: scale(1, 0.8); }
	44.7% { transform: scale(0.6, 0.8); }
	45.0% { transform: scale(0.6, 1.6); }
	45.3% { transform: scale(0.6, 2); }
	45.6% { transform: scale(0.6, 1.2); }
	45.9% { transform: scale(0.6, 1.5); }
	47.4% { transform: scale(0.6, 1.5); }
	47.7% { transform: scale(0.8, 1.5); }
	48.0% { transform: scale(0.8, 1); }
	48.3% { transform: scale(0.7, 0.9); }
	48.6% { transform: scale(0.6, 0.7); }
	48.9% { transform: scale(0.3, 0.2); }
	49.2% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart9 {
	0.0%  { transform: translate(10px, 6px) rotate(0deg); }
	12.0% { transform: translate(10px, 6px) rotate(0deg); }
	12.9% { transform: translate(6px, 5px) rotate(0deg); }
	14.4% { transform: translate(4px, 1px) rotate(0deg); }
	15.9% { transform: translate(0px, 18px) rotate(0deg); }
	18.0% { transform: translate(-1px, 2px) rotate(0deg); }
	20.7% { transform: translate(3px, -10px) rotate(0deg); }
	24.3% { transform: translate(3px, -12px) rotate(0deg); }
	26.1% { transform: translate(0px, 10px) rotate(0deg); }
	29.1% { transform: translate(-2px, -29px) rotate(0deg); }
	31.5% { transform: translate(-4px, -38px) rotate(0deg); }
	34.5% { transform: translate(-6px, -38px) rotate(0deg); }
	36.3% { transform: translate(0px, -51px) rotate(0deg); }
	39.6% { transform: translate(20px, -21px) rotate(0deg); }
	42.3% { transform: translate(33px, -19px) rotate(0deg); }
	43.8% { transform: translate(33px, -18px) rotate(0deg); }
	44.1% { transform: translate(37px, -7px) rotate(0deg); }
	44.4% { transform: translate(36px, -15px) rotate(0deg); }
	44.7% { transform: translate(36px, -39px) rotate(0deg); }
	45.0% { transform: translate(36px, -39px) rotate(0deg); }
	45.3% { transform: translate(42px, -88px) rotate(40deg); }
	45.6% { transform: translate(52px, -93px) rotate(80deg); }
	45.9% { transform: translate(118px, -63px) rotate(141deg); }
	46.2% { transform: translate(133px, -33px) rotate(164deg); }
	46.5% { transform: translate(136px, -23px) rotate(170deg); }
	46.8% { transform: translate(144px, 39px) rotate(166deg); }
	47.1% { transform: translate(152px, 73px) rotate(166deg); }
	47.4% { transform: translate(177px, 97px) rotate(146deg); }
	47.7% { transform: translate(202px, 116px) rotate(113deg); }
	48.0% { transform: translate(224px, 131px) rotate(113deg); }
	48.3% { transform: translate(235px, 131px) rotate(113deg); }
	48.6% { transform: translate(246px, 133px) rotate(113deg); }
	48.9% { transform: translate(244px, 131px) rotate(113deg); }
	100%  { transform: translate(244px, 131px) rotate(113deg); }
}
@keyframes soulPart9Before {
	0.0%  { transform: scale(1, 1); }
	12.0% { transform: scale(1, 1); }
	12.9% { transform: scale(1, 0.9); }
	14.4% { transform: scale(1, 0.8); }
	15.9% { transform: scale(1, 0.8); }
	18.0% { transform: scale(1, 1.5); }
	20.7% { transform: scale(1, 1.5); }
	24.3% { transform: scale(1, 1); }
	26.1% { transform: scale(1, 1); }
	29.1% { transform: scale(0.3, 0.4); }
	31.5% { transform: scale(0.3, 0.3); }
	34.5% { transform: scale(0.3, 0.3); }
	36.3% { transform: scale(0, 0); }
	39.6% { transform: scale(0, 0); }
	42.3% { transform: scale(2, 2); }
	43.8% { transform: scale(2, 2); }
	44.1% { transform: scale(2, 2.7); }
	44.4% { transform: scale(2, 2.7); }
	44.7% { transform: scale(1.5, 2); }
	45.0% { transform: scale(0.7, 1.2); }
	45.3% { transform: scale(0.4, 1.4); }
	45.6% { transform: scale(0.4, 1.4); }
	45.9% { transform: scale(0.4, 2); }
	46.2% { transform: scale(0.4, 2); }
	46.5% { transform: scale(0.7, 3); }
	46.8% { transform: scale(0.7, 3); }
	47.1% { transform: scale(0.7, 1.5); }
	47.4% { transform: scale(1, 2); }
	48.0% { transform: scale(1, 2); }
	48.3% { transform: scale(0.8, 1); }
	48.6% { transform: scale(0.8, 1); }
	48.9% { transform: scale(0.3, 0.4); }
	49.2% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart10 {
	0.0%  { transform: translate(0px, 7px) rotate(0deg); }
	12.0% { transform: translate(0px, 7px) rotate(0deg); }
	12.9% { transform: translate(1px, 8px) rotate(0deg); }
	14.4% { transform: translate(-6px, 4px) rotate(0deg); }
	15.9% { transform: translate(-6px, 4px) rotate(0deg); }
	18.0% { transform: translate(-6px, -2px) rotate(0deg); }
	20.7% { transform: translate(-14px, -11px) rotate(0deg); }
	24.3% { transform: translate(-7px, -5px) rotate(0deg); }
	26.1% { transform: translate(1px, -21px) rotate(0deg); }
	29.1% { transform: translate(-2px, -30px) rotate(0deg); }
	31.5% { transform: translate(0px, -27px) rotate(0deg); }
	34.5% { transform: translate(2px, -20px) rotate(0deg); }
	36.3% { transform: translate(-2px, -18px) rotate(0deg); }
	39.6% { transform: translate(0px, -26px) rotate(0deg); }
	42.3% { transform: translate(0px, -26px) rotate(0deg); }
	43.8% { transform: translate(0px, -16px) rotate(0deg); }
	44.1% { transform: translate(0px, -16px) rotate(0deg); }
	44.4% { transform: translate(1px, -24px) rotate(0deg); }
	44.7% { transform: translate(-3px, -44px) rotate(0deg); }
	45.0% { transform: translate(0px, -86px) rotate(45deg); }
	45.3% { transform: translate(37px, -109px) rotate(111deg); }
	45.6% { transform: translate(72px, -97px) rotate(127deg); }
	45.9% { transform: translate(107px, -61px) rotate(159deg); }
	46.2% { transform: translate(119px, -26px) rotate(172deg); }
	46.5% { transform: translate(124px, 18px) rotate(166deg); }
	46.8% { transform: translate(134px, 63px) rotate(151deg); }
	47.1% { transform: translate(162px, 101px) rotate(113deg); }
	47.4% { transform: translate(189px, 116px) rotate(88deg); }
	47.7% { transform: translate(207px, 121px) rotate(68deg); }
	48.0% { transform: translate(216px, 122px) rotate(53deg); }
	48.3% { transform: translate(228px, 123px) rotate(48deg); }
	48.6% { transform: translate(230px, 123px) rotate(48deg); }
	48.9% { transform: translate(222px, 121px) rotate(48deg); }
	100%  { transform: translate(222px, 121px) rotate(48deg); }
}
@keyframes soulPart10Before {
	0.0%  { transform: scale(0.7, 0.8); }
	12.0% { transform: scale(0.7, 0.8); }
	12.9% { transform: scale(0.9, 0.8); }
	14.4% { transform: scale(0.9, 0.9); }
	18.0% { transform: scale(0.9, 0.9); }
	20.7% { transform: scale(0.9, 0.6); }
	24.3% { transform: scale(0.9, 0.9); }
	26.1% { transform: scale(0.9, 0.9); }
	29.1% { transform: scale(0.8, 0.9); }
	31.5% { transform: scale(0.9, 0.9); }
	34.5% { transform: scale(0.9, 0.9); }
	36.3% { transform: scale(1, 1); }
	39.6% { transform: scale(1, 1); }
	42.3% { transform: scale(1.1, 1); }
	44.4% { transform: scale(1.1, 1); }
	44.7% { transform: scale(0.8, 1.1); }
	45.0% { transform: scale(0.4, 0.8); }
	45.3% { transform: scale(0.3, 0.6); }
	45.6% { transform: scale(0.35, 0.9); }
	45.9% { transform: scale(0.35, 0.9); }
	46.2% { transform: scale(0.4, 1.1); }
	46.8% { transform: scale(0.4, 1.1); }
	47.1% { transform: scale(0.4, 0.8); }
	47.4% { transform: scale(0.4, 0.8); }
	47.7% { transform: scale(0.45, 0.75); }
	48.0% { transform: scale(0.45, 0.7); }
	48.3% { transform: scale(0.45, 0.6); }
	48.6% { transform: scale(0.3, 0.4); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart11 {
	0.0%  { transform: translate(2px, 0px) rotate(0deg); }
	12.9% { transform: translate(1px, 0px) rotate(0deg); }
	14.4% { transform: translate(0px, 0px) rotate(0deg); }
	44.1% { transform: translate(0px, 0px) rotate(0deg); }
	44.4% { transform: translate(0px, -9px) rotate(0deg); }
	44.7% { transform: translate(0px, -18px) rotate(0deg); }
	45.0% { transform: translate(2px, -31px) rotate(3deg); }
	45.3% { transform: translate(3px, -54px) rotate(1deg); }
	45.6% { transform: translate(2px, -88px) rotate(-2deg); }
	45.9% { transform: translate(12px, -135px) rotate(43deg); }
	46.2% { transform: translate(50px, -147px) rotate(114deg); }
	46.5% { transform: translate(93px, -124px) rotate(133deg); }
	46.8% { transform: translate(123px, -65px) rotate(168deg); }
	47.1% { transform: translate(131px, -15px) rotate(175deg); }
	47.4% { transform: translate(144px, 32px) rotate(157deg); }
	47.7% { transform: translate(163px, 59px) rotate(137deg); }
	48.0% { transform: translate(183px, 69px) rotate(107deg); }
	48.3% { transform: translate(203px, 77px) rotate(102deg); }
	48.6% { transform: translate(216px, 80px) rotate(96deg); }
	48.9% { transform: translate(228px, 84px) rotate(96deg); }
	100%  { transform: translate(228px, 84px) rotate(96deg); }
}
@keyframes soulPart11Before {
	0.0%  { transform: scale(1.6, 1); }
	12.0% { transform: scale(1.6, 1); }
	12.9% { transform: scale(1.9, 1); }
	14.4% { transform: scale(2.1, 1); }
	15.9% { transform: scale(2.1, 1); }
	18.0% { transform: scale(1.3, 1); }
	20.7% { transform: scale(1.3, 1); }
	24.3% { transform: scale(2, 1); }
	26.1% { transform: scale(2, 1); }
	29.1% { transform: scale(1.2, 1); }
	31.5% { transform: scale(2, 1); }
	34.5% { transform: scale(2.4, 1); }
	36.3% { transform: scale(2, 1); }
	43.8% { transform: scale(2, 1); }
	44.1% { transform: scale(1.7, 1); }
	44.4% { transform: scale(1.7, 1); }
	44.7% { transform: scale(1.8, 1); }
	45.0% { transform: scale(1.8, 1); }
	45.3% { transform: scale(1.6, 1.2); }
	45.6% { transform: scale(1, 1.4); }
	45.9% { transform: scale(0.7, 0.7); }
	46.2% { transform: scale(0.4, 0.7); }
	46.5% { transform: scale(0.4, 0.7); }
	46.8% { transform: scale(0.6, 0.7); }
	47.1% { transform: scale(0.6, 0.7); }
	47.4% { transform: scale(1, 0.7); }
	48.6% { transform: scale(1, 0.7); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart12 {
	0.0%  { transform: translate(3px, 20px) rotate(0deg); }
	12.0% { transform: translate(3px, 20px) rotate(0deg); }
	12.9% { transform: translate(1px, 24px) rotate(0deg); }
	14.4% { transform: translate(-2px, 28px) rotate(0deg); }
	15.9% { transform: translate(-3px, 25px) rotate(0deg); }
	18.0% { transform: translate(-1px, 10px) rotate(0deg); }
	20.7% { transform: translate(0px, 0px) rotate(0deg); }
	24.3% { transform: translate(-2px, 17px) rotate(0deg); }
	26.1% { transform: translate(-2px, 15px) rotate(0deg); }
	29.1% { transform: translate(0px, 1px) rotate(0deg); }
	31.5% { transform: translate(-1px, 3px) rotate(0deg); }
	34.5% { transform: translate(-2px, 17px) rotate(0deg); }
	36.3% { transform: translate(-2px, 14px) rotate(0deg); }
	39.6% { transform: translate(0px, 0px) rotate(0deg); }
	42.3% { transform: translate(-1px, 9px) rotate(0deg); }
	43.8% { transform: translate(-2px, 16px) rotate(0deg); }
	44.1% { transform: translate(-1px, 16px) rotate(0deg); }
	44.4% { transform: translate(-1px, 9px) rotate(0deg); }
	44.7% { transform: translate(0px, -8px) rotate(-13deg); }
	45.0% { transform: translate(0px, -35px) rotate(2deg); }
	45.3% { transform: translate(13px, -66px) rotate(32deg); }
	45.6% { transform: translate(47px, -83px) rotate(92deg); }
	45.9% { transform: translate(92px, -65px) rotate(126deg); }
	46.2% { transform: translate(122px, -29px) rotate(156deg); }
	46.5% { transform: translate(137px, 21px) rotate(174deg); }
	46.8% { transform: translate(144px, 70px) rotate(170deg); }
	47.1% { transform: translate(162px, 112px) rotate(145deg); }
	47.4% { transform: translate(189px, 133px) rotate(115deg); }
	47.7% { transform: translate(211px, 140px) rotate(95deg); }
	48.0% { transform: translate(223px, 142px) rotate(66deg); }
	48.3% { transform: translate(237px, 145px) rotate(56deg); }
	48.6% { transform: translate(238px, 147px) rotate(56deg); }
	48.9% { transform: translate(228px, 151px) rotate(56deg); }
	100%  { transform: translate(228px, 151px) rotate(56deg); }
}
@keyframes soulPart12Before {
	0.0%  { transform: scale(0.9, 0.8); }
	12.0% { transform: scale(0.9, 0.8); }
	12.9% { transform: scale(1, 0.9); }
	14.4% { transform: scale(1.3, 0.9); }
	15.9% { transform: scale(1.4, 1); }
	18.0% { transform: scale(1.2, 1); }
	20.7% { transform: scale(1, 1); }
	24.3% { transform: scale(1.3, 1.1); }
	26.1% { transform: scale(1.3, 1.1); }
	29.1% { transform: scale(1.1, 1.1); }
	31.5% { transform: scale(1.1, 1.1); }
	34.5% { transform: scale(1.4, 1.1); }
	36.3% { transform: scale(1.4, 1.1); }
	39.6% { transform: scale(1, 1); }
	42.3% { transform: scale(1.2, 1.1); }
	43.8% { transform: scale(1.3, 1.1); }
	44.1% { transform: scale(1.3, 1.1); }
	44.4% { transform: scale(1.3, 1.1); }
	44.7% { transform: scale(1.1, 1.3); }
	45.0% { transform: scale(0.8, 1.5); }
	45.3% { transform: scale(0.5, 1.8); }
	45.6% { transform: scale(0.4, 1.9); }
	45.9% { transform: scale(0.4, 2.1); }
	46.2% { transform: scale(0.4, 2.1); }
	46.5% { transform: scale(0.6, 2); }
	46.8% { transform: scale(0.6, 1.6); }
	47.1% { transform: scale(0.5, 1.4); }
	47.4% { transform: scale(0.7, 1.3); }
	47.7% { transform: scale(0.7, 1); }
	48.0% { transform: scale(0.7, 0.7); }
	48.3% { transform: scale(0.6, 0.6); }
	48.6% { transform: scale(0.4, 0.5); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart13 {
	0.0%  { transform: translate(-1px, 18px) rotate(0deg); }
	12.0% { transform: translate(-1px, 18px) rotate(0deg); }
	12.9% { transform: translate(0px, 20px) rotate(0deg); }
	14.4% { transform: translate(1px, 18px) rotate(0deg); }
	15.9% { transform: translate(2px, 13px) rotate(0deg); }
	18.0% { transform: translate(1px, 2px) rotate(0deg); }
	20.7% { transform: translate(0px, 2px) rotate(0deg); }
	24.3% { transform: translate(2px, 5px) rotate(0deg); }
	26.1% { transform: translate(1px, 2px) rotate(0deg); }
	29.1% { transform: translate(0px, -1px) rotate(0deg); }
	31.5% { transform: translate(1px, 4px) rotate(0deg); }
	34.5% { transform: translate(2px, 5px) rotate(0deg); }
	36.3% { transform: translate(1px, 1px) rotate(0deg); }
	39.6% { transform: translate(0px, 0px) rotate(0deg); }
	42.3% { transform: translate(1px, 6px) rotate(0deg); }
	43.8% { transform: translate(1px, 6px) rotate(0deg); }
	44.1% { transform: translate(2px, 5px) rotate(0deg); }
	44.4% { transform: translate(2px, -3px) rotate(0deg); }
	44.7% { transform: translate(-1px, -23px) rotate(-20deg); }
	45.0% { transform: translate(-5px, -49px) rotate(-4deg); }
	45.3% { transform: translate(8px, -76px) rotate(51deg); }
	45.6% { transform: translate(42px, -78px) rotate(111deg); }
	45.9% { transform: translate(81px, -53px) rotate(138deg); }
	46.2% { transform: translate(101px, -15px) rotate(164deg); }
	46.5% { transform: translate(110px, 33px) rotate(175deg); }
	46.8% { transform: translate(119px, 80px) rotate(165deg); }
	47.1% { transform: translate(140px, 119px) rotate(136deg); }
	47.4% { transform: translate(167px, 139px) rotate(117deg); }
	47.7% { transform: translate(188px, 146px) rotate(91deg); }
	48.0% { transform: translate(200px, 150px) rotate(71deg); }
	48.3% { transform: translate(214px, 151px) rotate(71deg); }
	48.6% { transform: translate(216px, 150px) rotate(71deg); }
	48.9% { transform: translate(206px, 147px) rotate(71deg); }
	100%  { transform: translate(206px, 147px) rotate(71deg); }
}
@keyframes soulPart13Before {
	0.0%  { transform: scale(0.8, 0.8); }
	12.0% { transform: scale(0.8, 0.8); }
	12.9% { transform: scale(0.9, 0.8); }
	14.4% { transform: scale(1, 0.8); }
	18.0% { transform: scale(1, 0.8); }
	20.7% { transform: scale(1, 1); }
	24.3% { transform: scale(1.1, 0.9); }
	26.1% { transform: scale(1, 0.9); }
	29.1% { transform: scale(0.9, 1); }
	31.5% { transform: scale(1.2, 1); }
	34.5% { transform: scale(1.1, 0.9); }
	36.3% { transform: scale(1.1, 0.9); }
	39.6% { transform: scale(1, 1); }
	42.3% { transform: scale(1.2, 1); }
	43.8% { transform: scale(1.1, 1); }
	44.4% { transform: scale(1.1, 1); }
	44.7% { transform: scale(0.9, 1); }
	45.0% { transform: scale(0.6, 1.1); }
	45.3% { transform: scale(0.3, 1.2); }
	45.6% { transform: scale(0.4, 1.4); }
	45.9% { transform: scale(0.3, 1.6); }
	46.2% { transform: scale(0.3, 1.5); }
	46.5% { transform: scale(0.3, 1.5); }
	46.8% { transform: scale(0.4, 1.3); }
	47.1% { transform: scale(0.4, 1.3); }
	47.4% { transform: scale(0.4, 1); }
	47.7% { transform: scale(0.4, 0.8); }
	48.0% { transform: scale(0.7, 0.7); }
	48.3% { transform: scale(0.4, 0.5); }
	48.6% { transform: scale(0.3, 0.4); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart14 {
	0.0%  { transform: translate(0px, 26px) rotate(0deg); }
	12.0% { transform: translate(0px, 26px) rotate(0deg); }
	12.9% { transform: translate(0px, 27px) rotate(0deg); }
	14.4% { transform: translate(1px, 26px) rotate(0deg); }
	15.9% { transform: translate(1px, 20px) rotate(0deg); }
	18.0% { transform: translate(1px, 0px) rotate(0deg); }
	20.7% { transform: translate(1px, 30px) rotate(0deg); }
	24.3% { transform: translate(1px, 5px) rotate(0deg); }
	26.1% { transform: translate(1px, 3px) rotate(0deg); }
	28.8% { transform: translate(1px, -2px) rotate(0deg); }
	29.1% { transform: translate(1px, 28px) rotate(0deg); }
	31.5% { transform: translate(0px, 4px) rotate(0deg); }
	34.5% { transform: translate(0px, 4px) rotate(0deg); }
	36.3% { transform: translate(1px, 2px) rotate(0deg); }
	39.0% { transform: translate(1px, -18px) rotate(0deg); }
	42.3% { transform: translate(1px, -18px) rotate(0deg); }
	43.8% { transform: translate(1px, 52px) rotate(0deg); }
	44.1% { transform: translate(29px, 36px) rotate(50deg); }
	44.4% { transform: translate(29px, 36px) rotate(50deg); }
	44.7% { transform: translate(-1px, 74px) rotate(50deg); }
	45.0% { transform: translate(-1px, 44px) rotate(50deg); }
	45.3% { transform: translate(23px, -34px) rotate(68deg); }
	45.6% { transform: translate(37px, -39px) rotate(98deg); }
	45.9% { transform: translate(81px, -20px) rotate(130deg); }
	46.2% { transform: translate(102px, 5px) rotate(154deg); }
	46.5% { transform: translate(124px, 59px) rotate(177deg); }
	46.8% { transform: translate(130px, 117px) rotate(167deg); }
	47.1% { transform: translate(142px, 153px) rotate(132deg); }
	47.4% { transform: translate(155px, 172px) rotate(122deg); }
	47.7% { transform: translate(176px, 187px) rotate(122deg); }
	48.0% { transform: translate(194px, 201px) rotate(92deg); }
	48.3% { transform: translate(211px, 201px) rotate(92deg); }
	48.6% { transform: translate(218px, 194px) rotate(62deg); }
	100%  { transform: translate(218px, 194px) rotate(62deg); }
}
@keyframes soulPart14Before {
	0.0%  { transform: scale(0.6, 1); }
	12.0% { transform: scale(0.6, 1); }
	12.9% { transform: scale(0.7, 0.8); }
	14.4% { transform: scale(0.7, 0.8); }
	15.9% { transform: scale(0.7, 0.6); }
	18.0% { transform: scale(0.2, 0.3); }
	18.6% { transform: scale(0, 0); }
	20.7% { transform: scale(0, 0); }
	24.3% { transform: scale(0.9, 1); }
	26.1% { transform: scale(0.7, 0.8); }
	28.8% { transform: scale(0, 0); }
	29.1% { transform: scale(0, 0); }
	31.5% { transform: scale(1, 1); }
	34.5% { transform: scale(1, 1); }
	36.3% { transform: scale(0.7, 0.7); }
	39.0% { transform: scale(0, 0); }
	43.8% { transform: scale(0, 0); }
	44.1% { transform: scale(1.5, 1.5); }
	45.0% { transform: scale(1.5, 1.5); }
	45.3% { transform: scale(1, 2); }
	45.6% { transform: scale(1.6, 3.9); }
	45.9% { transform: scale(1.6, 5); }
	46.2% { transform: scale(1.8, 6); }
	46.5% { transform: scale(1.8, 7); }
	46.8% { transform: scale(1.8, 6); }
	47.1% { transform: scale(2, 5); }
	47.4% { transform: scale(2, 4); }
	47.7% { transform: scale(2, 3); }
	48.0% { transform: scale(1, 2); }
	48.3% { transform: scale(1, 2); }
	48.6% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart15 {
	0.0%  { transform: translate(-6px, -3px) rotate(0deg); }
	12.0% { transform: translate(-6px, -3px) rotate(0deg); }
	12.9% { transform: translate(-5px, -2px) rotate(0deg); }
	14.4% { transform: translate(-2px, -1px) rotate(0deg); }
	15.9% { transform: translate(-2px, -2px) rotate(0deg); }
	18.0% { transform: translate(-3px, -14px) rotate(0deg); }
	20.7% { transform: translate(-4px, -12px) rotate(0deg); }
	24.3% { transform: translate(-3px, -3px) rotate(0deg); }
	26.1% { transform: translate(-2px, -5px) rotate(0deg); }
	28.2% { transform: translate(-6px, -21px) rotate(0deg); }
	29.1% { transform: translate(-6px, -21px) rotate(0deg); }
	31.5% { transform: translate(-4px, -7px) rotate(0deg); }
	34.5% { transform: translate(-3px, -3px) rotate(0deg); }
	36.3% { transform: translate(-3px, -5px) rotate(0deg); }
	39.6% { transform: translate(-9px, -35px) rotate(0deg); }
	42.3% { transform: translate(-3px, -5px) rotate(0deg); }
	43.8% { transform: translate(-3px, -3px) rotate(0deg); }
	44.1% { transform: translate(-4px, -5px) rotate(0deg); }
	44.4% { transform: translate(-3px, -8px) rotate(0deg); }
	44.7% { transform: translate(-4px, -18px) rotate(0deg); }
	45.0% { transform: translate(-5px, -35px) rotate(10deg); }
	45.3% { transform: translate(-6px, -59px) rotate(0deg); }
	45.6% { transform: translate(-10px, -90px) rotate(-10deg); }
	45.9% { transform: translate(-11px, -122px) rotate(0deg); }
	46.2% { transform: translate(25px, -144px) rotate(110deg); }
	46.5% { transform: translate(70px, -118px) rotate(133deg); }
	46.8% { transform: translate(96px, -66px) rotate(159deg); }
	47.1% { transform: translate(103px, -13px) rotate(169deg); }
	47.4% { transform: translate(116px, 34px) rotate(148deg); }
	47.7% { transform: translate(139px, 65px) rotate(128deg); }
	48.0% { transform: translate(153px, 82px) rotate(128deg); }
	100%  { transform: translate(153px, 82px) rotate(128deg); }
}
@keyframes soulPart15Before {
	0.0%  { transform: scale(0.8, 0.6); }
	12.9% { transform: scale(0.8, 0.6); }
	14.4% { transform: scale(1, 0.8); }
	15.9% { transform: scale(1, 0.8); }
	18.0% { transform: scale(1.4, 1); }
	20.7% { transform: scale(1, 0.8); }
	24.3% { transform: scale(1.2, 0.8); }
	29.1% { transform: scale(1.2, 0.8); }
	31.5% { transform: scale(1, 0.8); }
	34.5% { transform: scale(1.2, 0.8); }
	39.6% { transform: scale(1.2, 0.8); }
	42.3% { transform: scale(1, 0.8); }
	43.8% { transform: scale(1.2, 0.8); }
	44.1% { transform: scale(1, 0.8); }
	44.4% { transform: scale(1, 0.8); }
	44.7% { transform: scale(0.9, 1); }
	45.0% { transform: scale(0.9, 1.1); }
	45.3% { transform: scale(0.6, 1.2); }
	45.6% { transform: scale(0.5, 1.3); }
	45.9% { transform: scale(0.3, 0.6); }
	46.2% { transform: scale(0.3, 1.3); }
	46.5% { transform: scale(0.3, 1.3); }
	46.8% { transform: scale(0.4, 1); }
	47.7% { transform: scale(0.4, 1); }
	48.0% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
@keyframes soulPart16 {
	0.0%  { transform: translate(15px, -31px) rotate(0deg); }
	12.0% { transform: translate(15px, -31px) rotate(0deg); }
	12.9% { transform: translate(20px, -30px) rotate(0deg); }
	14.4% { transform: translate(25px, -28px) rotate(0deg); }
	15.9% { transform: translate(27px, -27px) rotate(0deg); }
	18.0% { transform: translate(24px, -32px) rotate(0deg); }
	20.7% { transform: translate(23px, -38px) rotate(0deg); }
	24.3% { transform: translate(25px, -34px) rotate(0deg); }
	26.1% { transform: translate(26px, -32px) rotate(0deg); }
	29.1% { transform: translate(23px, -36px) rotate(0deg); }
	31.5% { transform: translate(23px, -38px) rotate(0deg); }
	34.5% { transform: translate(25px, -33px) rotate(0deg); }
	36.3% { transform: translate(26px, -32px) rotate(0deg); }
	39.6% { transform: translate(22px, -37px) rotate(0deg); }
	42.3% { transform: translate(24px, -36px) rotate(0deg); }
	43.8% { transform: translate(26px, -34px) rotate(0deg); }
	44.1% { transform: translate(27px, -35px) rotate(0deg); }
	44.4% { transform: translate(25px, -39px) rotate(0deg); }
	44.7% { transform: translate(23px, -52px) rotate(0deg); }
	45.0% { transform: translate(19px, -73px) rotate(0deg); }
	45.3% { transform: translate(12px, -98px) rotate(0deg); }
	45.6% { transform: translate(0px, -125px) rotate(0deg); }
	45.9% { transform: translate(14px, -149px) rotate(90deg); }
	46.2% { transform: translate(49px, -139px) rotate(117deg); }
	46.5% { transform: translate(81px, -106px) rotate(157deg); }
	46.8% { transform: translate(92px, -55px) rotate(172deg); }
	47.1% { transform: translate(99px, -5px) rotate(172deg); }
	47.4% { transform: translate(115px, 38px) rotate(152deg); }
	47.7% { transform: translate(140px, 65px) rotate(132deg); }
	48.0% { transform: translate(162px, 79px) rotate(122deg); }
	48.3% { transform: translate(183px, 83px) rotate(102deg); }
	48.6% { transform: translate(196px, 80px) rotate(82deg); }
	48.9% { transform: translate(206px, 78px) rotate(82deg); }
	100%  { transform: translate(206px, 78px) rotate(82deg); }
}
@keyframes soulPart16Before {
	0.0%  { transform: scale(0.7, 0.5); }
	12.0% { transform: scale(0.7, 0.5); }
	12.9% { transform: scale(0.9, 0.6); }
	36.3% { transform: scale(0.9, 0.6); }
	39.6% { transform: scale(0.9, 0.7); }
	44.7% { transform: scale(0.9, 0.7); }
	45.0% { transform: scale(0.7, 0.8); }
	45.6% { transform: scale(0.4, 0.8); }
	45.9% { transform: scale(0.3, 0.7); }
	47.7% { transform: scale(0.6, 0.7); }
	48.0% { transform: scale(0.6, 0.5); }
	48.3% { transform: scale(0.6, 0.5); }
	48.6% { transform: scale(0.3, 0.3); }
	48.9% { transform: scale(0, 0); }
	100%  { transform: scale(0, 0); }
}
</style>
<template>
    <div class="picture">
        <div class="forest">
        <div class="forest__tree"></div>
        <div class="forest__monster-1">
            <div></div>
            <div></div>
        </div>
        <div class="forest__monster-2">
            <div></div>
        </div>
        <div class="forest__ghost">
            <div></div>
        </div>
        <div class="forest__moss"></div>
        </div>
        <div class="house">
        <div class="house__wall">
            <div class="bat-1">
            <div></div>
            </div>
            <div class="bat-2">
            <div></div>
            </div>
        </div>
        <div class="house__window">
            <div class="greenery"></div>
            <div class="leaf-1"></div>
            <div class="leaf-2"></div>
            <div class="leaf-3"></div>
            <div class="leaf-4"></div>
            <div class="leaf-5"></div>
            <div class="leaf-6"></div>
            <div class="leaf-7"></div>
            <div class="mushroom-1"></div>
            <div class="mushroom-2"></div>
            <div class="lamp"></div>
            <div class="casket"></div>
            <div class="pineapple"></div>
            <div class="berries"></div>
        </div>
        <div class="shelf">
            <div class="shelf__staff-1"></div>
            <div class="shelf__staff-2">
            <div class="dust-1"></div>
            <div class="dust-2"></div>
            <div class="dust-3"></div>
            <div class="dust-4"></div>
            </div>
            <div class="shelf__staff-3"></div>
            <div class="shelf__staff-4"></div>
            <div class="shelf__staff-5"></div>
            <div class="shelf__staff-6"></div>
            <div class="shelf__staff-7"></div>
            <div class="shelf__staff-8">
            <div class="dust-1"></div>
            <div class="dust-2"></div>
            <div class="dust-3"></div>
            <div class="dust-4"></div>
            </div>
            <div class="shelf__staff-9"></div>
            <div class="shelf__staff-10"></div>
            <div class="shelf__staff-11"></div>
            <div class="shelf__herb-rope-1"></div>
            <div class="shelf__herbs-1"></div>
            <div class="shelf__herbs-2">
            <div class="shelf__herb-rope-2"></div>
            </div>
            <div class="shelf__herbs-3">
            <div class="shelf__herb-rope-3"></div>
            </div>
            <div class="shelf__herbs-4">
            <div class="shelf__herb-rope-4"></div>
            </div>
            <div class="shelf__thing">
            <div class="shelf__circles"></div>
            </div>
        </div>
        <div class="besom">
            <div class="rope"></div>
        </div>
        <div class="moth-rope"></div>
        <div class="moth">
            <div class="moth__wings"></div>
        </div>
        <div class="ladder"></div>
        <div class="wreath"></div>
        <div class="hook">
            <div class="dried-flower">
            <div class="dried-flower__petals"></div>
            </div>
        </div>
        <div class="chair"></div>
        <div class="alchemist">
            <div class="alchemist__coat-1"></div>
            <div class="alchemist__leg-r"></div>
            <div class="alchemist__leg-l"></div>
            <div class="alchemist__body"></div>
            <div class="alchemist__arm-r"></div>
            <div class="alchemist__arm-l"></div>
            <div class="alchemist__coat-2"></div>
            <div class="alchemist__coat-3"></div>
            <div class="alchemist__hat">
            <div class="alchemist__cat-tail"></div>
            <div class="alchemist__hat-1"></div>
            <div class="alchemist__hat-2"></div>
            <div class="alchemist__hat-3"></div>
            <div class="alchemist__hat-4"></div>
            <div class="alchemist__cat">
                <div class="alchemist__cat-face"></div>
            </div>
            <div class="alchemist__hat-5"></div>
            <div class="alchemist__hat-6"></div>
            <div class="alchemist__hat-7"></div>
            <div class="alchemist__forelock"></div>
            </div>
            <div class="alchemist__head">
            <div class="alchemist__ear-r"></div>
            <div class="alchemist__ear-l"></div>
            <div class="alchemist__beard"></div>
            <div class="alchemist__mustache"></div>
            <div class="alchemist__eye-r"></div>
            <div class="alchemist__eye-l"></div>
            </div>
        </div>
        <div class="pedal">
            <div>
            <div></div>
            </div>
        </div>
        <div class="table">
            <div class="snail">
            <div class="snail__tail">
                <div></div>
            </div>
            <div class="snail__body">
                <div class="snail__head"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            </div>
            <div class="piggy">
            <div class="piggy__front-legs"></div>
            <div class="piggy__back-legs"></div>
            <div class="piggy__hair"></div>
            <div class="piggy__body"></div>
            <div class="piggy__ear-right"></div>
            <div class="piggy__ear-left"></div>
            <div class="piggy__tail"></div>
            <div class="piggy__eyes"></div>
            <div class="piggy__mouth"></div>
            </div>
            <div class="wasp">
            <div class="wasp__legs">
                <div></div>
            </div>
            <div class="wasp__body">
                <div></div>
            </div>
            <div class="wasp__wing"></div>
            </div>
            <div class="bottle-1">
            <div></div>
            <div></div>
            </div>
            <div class="bottle-2">
            <div>
                <div class="bottle-2__water"></div>
                <div class="bottle-2__dude-1"></div>
                <div class="bottle-2__dude-2"></div>
                <div class="bottle-2__dude-3"></div>
            </div>
            </div>
            <div class="bottle-3">
            <div>
                <div class="bottle-3__dude-1"></div>
                <div class="bottle-3__dude-2"></div>
                <div class="bottle-3__dude-3"></div>
            </div>
            <div class="dust-content dust-1"></div>
            <div class="dust-content dust-2"></div>
            <div class="dust-content dust-3"></div>
            <div class="dust-content dust-4"></div>
            <div class="dust-content dust-5"></div>
            <div class="dust-content dust-6"></div>
            <div class="dust-content dust-7"></div>
            <div class="dust-content dust-8"></div>
            <div class="dust-content dust-9"></div>
            <div class="dust-content dust-10"></div>
            </div>
            <div class="mushroom-3">
            <div></div>
            </div>
            <div class="mushroom-4"></div>
            <div class="plants">
            <div></div>
            </div>
            <div class="plants-2">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div>
            <div class="nut"></div>
            <div class="fire">
            <div class="fire__item1"></div>
            <div class="fire__item2"></div>
            <div class="fire__item3"></div>
            <div class="fire__item4"></div>
            <div class="fire__item5"></div>
            <div class="fire__item6"></div>
            <div class="fire__item7"></div>
            <div class="fire__item8"></div>
            <div class="fire__item9"></div>
            <div class="fire__item10"></div>
            </div>
            <div class="skulp">
            <div></div>
            <div></div>
            </div>
            <div class="soul-1">
            <div class="soul-1__part1"></div>
            <div class="soul-1__part2"></div>
            <div class="soul-1__part3"></div>
            <div class="soul-1__part4"></div>
            <div class="soul-1__part5"></div>
            <div class="soul-1__part6"></div>
            <div class="soul-1__part7"></div>
            <div class="soul-1__part8"></div>
            <div class="soul-1__part9"></div>
            <div class="soul-1__part10"></div>
            <div class="soul-1__part11"></div>
            <div class="soul-1__part12"></div>
            <div class="soul-1__part13"></div>
            <div class="soul-1__part14"></div>
            <div class="soul-1__part15"></div>
            <div class="soul-1__part16"></div>
            </div>
            <div class="soul-2">
            <div class="soul-2__part1"></div>
            <div class="soul-2__part2"></div>
            <div class="soul-2__part3"></div>
            <div class="soul-2__part4"></div>
            <div class="soul-2__part5"></div>
            <div class="soul-2__part6"></div>
            <div class="soul-2__part7"></div>
            <div class="soul-2__part8"></div>
            <div class="soul-2__part9"></div>
            <div class="soul-2__part10"></div>
            <div class="soul-2__part11"></div>
            <div class="soul-2__part12"></div>
            <div class="soul-2__part13"></div>
            <div class="soul-2__part14"></div>
            <div class="soul-2__part15"></div>
            <div class="soul-2__part16"></div>
            </div>
            <div class="soul-3">
            <div class="soul-3__part1"></div>
            <div class="soul-3__part2"></div>
            <div class="soul-3__part3"></div>
            <div class="soul-3__part4"></div>
            <div class="soul-3__part5"></div>
            <div class="soul-3__part6"></div>
            <div class="soul-3__part7"></div>
            <div class="soul-3__part8"></div>
            <div class="soul-3__part9"></div>
            <div class="soul-3__part10"></div>
            <div class="soul-3__part11"></div>
            <div class="soul-3__part12"></div>
            <div class="soul-3__part13"></div>
            <div class="soul-3__part14"></div>
            <div class="soul-3__part15"></div>
            <div class="soul-3__part16"></div>
            </div>
            <div class="pot">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div class="pot__drop"></div>
            <div class="pot__bubble-1"></div>
            <div class="pot__bubble-2"></div>
            <div class="pot__bubble-3"></div>
            </div>
            <div class="bottle-4">
            <div class="bottle-4__dude">
                <div class="bottle-4__dude-head">
                <div class="bottle-4__dude-hair-1"></div>
                <div class="bottle-4__dude-hair-2"></div>
                <div class="bottle-4__dude-hair-3"></div>
                </div>
            </div>
            </div>
        </div>
        <div class="basket">
            <div></div>
        </div>
        <div class="cage"></div>
        <div class="staff">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        </div>
    </div>
</template>