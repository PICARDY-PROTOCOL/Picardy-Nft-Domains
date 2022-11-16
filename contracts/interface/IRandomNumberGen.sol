// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;
interface IRandomNumberGen {
    function requestRandomNumber(uint32 numWords) external returns (uint256 requestId);
    function getRandomNumber(uint256 _requestId) external returns (uint256[] memory);
    function getRequestState(uint256 _requestId) external view returns (bool fulfilled, bool exists, bool seen);
    function setKeyHash(bytes32 _keyHash) external;
    function setSubscriptionId(uint64 _subscriptionId) external;
    function setRequestConfirmations(uint16 _requestConfirmations) external;
    function setCallbackGasLimit(uint32 _callbackGasLimit) external;
    function withdrawLink() external;
    function withdrawEther() external;
    function getChainlinkTokenBalance() external view returns (uint256);
    function fee() external view returns (uint256);
}