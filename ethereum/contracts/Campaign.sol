pragma solidity ^0.8.4;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(string campaignName, string campaignDescription, uint256 minimumAmount) public {
        address newCampign = new Campaign(campaignName, campaignDescription, minimumAmount, msg.sender);
        deployedCampaigns.push(newCampign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;

    string public name;
    string public description;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount = 0;

    uint8 constant minimumApprovalPercentage = 50;

    constructor(string campaignName, string campaignDescription, uint256 minimumAmount, address creator) public {
        name = campaignName;
        description = campaignDescription;
        manager = creator;
        minimumContribution = minimumAmount;
    }

    modifier requireMinimumContributiom() {
        require(
            msg.value >= minimumContribution,
            "Require minimum contribution to send."
        );
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can do");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Only approver can do");
        _;
    }

    modifier onlyValidValidRequest(uint256 index) {
        require(
            index < requests.length,
            "index of the request does not exist."
        );
        _;
    }

    function isEnoughApprovalPercentage(uint256 approvalCount)
        private
        returns (bool)
    {
        bool isEnough = false;
        if (approversCount > 0) {
            isEnough =
                ((approvalCount * 100) / approversCount) >
                minimumApprovalPercentage;
        }
        return isEnough;
    }

    function contribute() public payable requireMinimumContributiom {
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public onlyManager {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 index)
        public
        onlyApprover
        onlyValidValidRequest(index)
    {
        Request storage currentRequest = requests[index];

        require(!currentRequest.approvals[msg.sender], "Already voted.");

        currentRequest.approvals[msg.sender] = true;
        currentRequest.approvalCount++;
    }

    function finalizedRequest(uint256 index)
        public
        payable
        onlyManager
        onlyValidValidRequest(index)
    {
        Request storage currentRequest = requests[index];

        require(!currentRequest.complete, "Request already finalized.");
        require(
            isEnoughApprovalPercentage(currentRequest.approvalCount),
            "Not enough approvals percentage."
        );

        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address, string, string
    ) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            name,
            description
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }
}
